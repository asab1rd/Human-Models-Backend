/**
 * Rate limiting middleware for Human Paris CMS
 * Protects API endpoints from abuse and excessive requests
 */


interface RateLimitConfig {
  max: number;
  duration: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (ctx: any) => string;
}

const defaultConfig: RateLimitConfig = {
  max: 100,
  duration: 60000, // 1 minute
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
};

// In-memory store for rate limiting (in production, use Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export default (config: Partial<RateLimitConfig> = {}, { strapi }: { strapi: any }) => {
  const finalConfig = { ...defaultConfig, ...config };
  
  return async (ctx: any, next: any) => {
    // Skip rate limiting in development
    if (process.env.NODE_ENV === 'development') {
      return await next();
    }
    
    // Generate key for this request
    const key = finalConfig.keyGenerator 
      ? finalConfig.keyGenerator(ctx)
      : getDefaultKey(ctx);
    
    const now = Date.now();
    const record = requestCounts.get(key);
    
    // Clean up expired records
    if (record && now > record.resetTime) {
      requestCounts.delete(key);
    }
    
    // Get current count
    const currentRecord = requestCounts.get(key) || { 
      count: 0, 
      resetTime: now + finalConfig.duration 
    };
    
    // Check if limit exceeded
    if (currentRecord.count >= finalConfig.max) {
      ctx.status = 429;
      ctx.body = {
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((currentRecord.resetTime - now) / 1000),
      };
      
      // Set rate limit headers
      ctx.set({
        'X-RateLimit-Limit': finalConfig.max.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': Math.ceil(currentRecord.resetTime / 1000).toString(),
        'Retry-After': Math.ceil((currentRecord.resetTime - now) / 1000).toString(),
      });
      
      console.warn(`🚫 Rate limit exceeded for key: ${key}`);
      return;
    }
    
    // Increment counter
    currentRecord.count++;
    requestCounts.set(key, currentRecord);
    
    // Set rate limit headers
    ctx.set({
      'X-RateLimit-Limit': finalConfig.max.toString(),
      'X-RateLimit-Remaining': (finalConfig.max - currentRecord.count).toString(),
      'X-RateLimit-Reset': Math.ceil(currentRecord.resetTime / 1000).toString(),
    });
    
    try {
      await next();
      
      // Optionally skip counting successful requests
      if (finalConfig.skipSuccessfulRequests && ctx.status < 400) {
        currentRecord.count--;
        requestCounts.set(key, currentRecord);
      }
    } catch (error) {
      // Optionally skip counting failed requests
      if (finalConfig.skipFailedRequests) {
        currentRecord.count--;
        requestCounts.set(key, currentRecord);
      }
      
      throw error;
    }
  };
};

/**
 * Generate default rate limit key
 */
function getDefaultKey(ctx: any): string {
  // Use IP address as default key
  const ip = ctx.request.ip || 
    ctx.request.header['x-forwarded-for'] || 
    ctx.request.header['x-real-ip'] || 
    'unknown';
  
  // Include endpoint for more granular control
  const endpoint = ctx.request.path;
  
  return `${ip}:${endpoint}`;
}

/**
 * Cleanup expired entries periodically
 */
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      keysToDelete.push(key);
    }
  }
  
  keysToDelete.forEach(key => requestCounts.delete(key));
  
  if (keysToDelete.length > 0) {
    console.log(`🧹 Cleaned up ${keysToDelete.length} expired rate limit records`);
  }
}, 60000); // Cleanup every minute