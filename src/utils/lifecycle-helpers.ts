/**
 * Common lifecycle helper functions for Human Paris CMS
 * Provides reusable utilities for content type lifecycles
 */

import slugify from 'slugify';

/**
 * Generate SEO-friendly slug from text
 */
export function generateSlug(text: string, locale: string = 'en'): string {
  if (!text) return '';
  
  return slugify(text, {
    lower: true,
    strict: true,
    locale,
    remove: /[*+~.()'"!:@]/g, // Remove special characters
  });
}

/**
 * Generate SEO metadata from content
 */
export function generateSeoMetadata(data: any): any {
  const seo: any = {};
  
  // Generate meta title
  if (data.title) {
    seo.metaTitle = data.title.length > 60 
      ? `${data.title.substring(0, 57)}...` 
      : data.title;
  }
  
  // Generate meta description
  if (data.description) {
    seo.metaDescription = data.description.length > 160 
      ? `${data.description.substring(0, 157)}...` 
      : data.description;
  } else if (data.content) {
    // Extract text from rich content
    const plainText = extractPlainText(data.content);
    seo.metaDescription = plainText.length > 160 
      ? `${plainText.substring(0, 157)}...` 
      : plainText;
  }
  
  // Generate keywords from tags or categories
  if (data.tags && Array.isArray(data.tags)) {
    seo.keywords = data.tags.join(', ');
  }
  
  return seo;
}

/**
 * Extract plain text from rich content
 */
export function extractPlainText(richContent: any): string {
  if (typeof richContent === 'string') {
    // Remove HTML tags and return plain text
    return richContent.replace(/<[^>]*>/g, '').trim();
  }
  
  if (Array.isArray(richContent)) {
    // Handle Strapi rich text blocks format
    return richContent
      .map((block: any) => {
        if (block.type === 'paragraph' && block.children) {
          return block.children.map((child: any) => child.text || '').join('');
        }
        return '';
      })
      .join(' ')
      .trim();
  }
  
  return '';
}

/**
 * Invalidate cache for multiple tags/keys
 */
export async function invalidateCache(tags: string[]): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔄 Cache invalidation triggered for tags: ${tags.join(', ')}`);
    return;
  }

  // Cloudflare cache invalidation
  if (process.env.CLOUDFLARE_ZONE_ID && process.env.CLOUDFLARE_API_TOKEN) {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/purge_cache`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tags }),
        }
      );

      if (response.ok) {
        console.log(`✅ Cloudflare cache invalidated for tags: ${tags.join(', ')}`);
      } else {
        console.warn(`⚠️ Failed to invalidate Cloudflare cache: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Error invalidating Cloudflare cache:', error);
    }
  }

  // Add other CDN integrations here (AWS CloudFront, Fastly, etc.)
}

/**
 * Log content operations for monitoring
 */
export function logContentOperation(
  operation: 'create' | 'update' | 'delete',
  contentType: string,
  data: any
): void {
  const timestamp = new Date().toISOString();
  const title = data.title || data.name || data.id;
  
  console.log(`[${timestamp}] ${operation.toUpperCase()} ${contentType}: "${title}" (ID: ${data.id})`);
  
  // In production, you might want to send this to a monitoring service
  if (process.env.NODE_ENV === 'production' && process.env.MONITORING_WEBHOOK) {
    // Example: send to monitoring service
    fetch(process.env.MONITORING_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp,
        operation,
        contentType,
        title,
        id: data.id,
      }),
    }).catch((error) => {
      console.error('Failed to send monitoring data:', error);
    });
  }
}

/**
 * Validate required fields for content types
 */
export function validateRequiredFields(data: any, requiredFields: string[]): string[] {
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missingFields.push(field);
    }
  }
  
  return missingFields;
}

/**
 * Process image uploads and generate metadata
 */
export async function processImageUpload(file: any): Promise<any> {
  if (!file) return null;
  
  // Add image processing logic here
  // Could integrate with services like Cloudinary, ImageKit, etc.
  
  console.log(`📸 Processing image upload: ${file.name}`);
  
  return {
    processedAt: new Date().toISOString(),
    originalSize: file.size,
    // Add other metadata as needed
  };
}