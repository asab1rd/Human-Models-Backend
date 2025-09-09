# Human Paris CMS - Infrastructure & Configuration

This document outlines the advanced configuration and infrastructure improvements implemented for the Human Paris modeling agency CMS.

## 🏗️ Architecture Overview

The CMS has been configured with production-ready settings optimized for a modeling agency's specific needs:

- **High-volume media handling** (100MB upload limits)
- **Professional photography optimization** with responsive breakpoints
- **External video integration** (YouTube, Vimeo, Instagram)
- **Advanced security** with CSP headers
- **Performance optimization** for complex model/photo relations
- **Strapi Cloud deployment readiness**

## 📋 Configuration Files

### 1. Enhanced Plugin Configuration (`config/plugins.ts`)

```typescript
// Key features:
- 100MB upload limits for professional photography
- Responsive image breakpoints (150px to 1920px)
- i18n configuration for French/English
- Users-permissions JWT configuration
```

**Image Breakpoints:**
- `thumbnail`: 150px (profile previews)
- `small`: 500px (mobile displays)
- `medium`: 750px (tablet displays)  
- `large`: 1000px (desktop displays)
- `xlarge`: 1920px (high-resolution displays)

### 2. Advanced Security & CORS (`config/middlewares.ts`)

```typescript
// Security features:
- CSP headers for external video embeds
- CORS configuration for frontend integration
- Large file upload support (100MB)
- Multiple domain support (humanparis.com, assets subdomain)
```

**Supported External Media:**
- YouTube embeds (`*.youtube.com`)
- Vimeo embeds (`*.vimeo.com`)
- Instagram embeds (`*.instagram.com`)
- Cloudinary assets (`res.cloudinary.com`)

### 3. Database Optimization (`config/database.ts`)

```typescript
// Performance features:
- Increased connection pools (max: 20) for modeling agency load
- Optimized timeouts for large media queries
- UTF8MB4 charset support for emoji and international content
- Production-ready PostgreSQL configuration
```

### 4. API Configuration (`config/api.ts`)

```typescript
// API optimizations:
- Increased pagination limits (max: 200) for model portfolios
- Enhanced populate defaults for complex relations
- Optimized for gallery and portfolio queries
```

### 5. Admin Panel (`config/admin.ts`)

```typescript
// Admin features:
- Extended JWT expiration (7 days) for agency workflow
- Rate limiting protection
- Upload limits configuration
- Performance monitoring settings
```

### 6. Server Configuration (`config/server.ts`)

```typescript
// Server optimizations:
- Extended request timeout (5 minutes) for large uploads
- Socket.io configuration for real-time features
- Webhook configuration
- Static file serving optimization
```

## 🔧 Custom Middleware

### File Processing Middleware (`src/middlewares/file-processing.ts`)

Automatically processes uploaded images:

- **Responsive variants generation** using Sharp
- **Image metadata extraction** (dimensions, format, color space)
- **Professional photography optimization**
- **Automatic file organization**

### Rate Limiting Middleware (`src/middlewares/rate-limit.ts`)

Protects API endpoints:

- **Configurable rate limits** per endpoint
- **IP-based tracking** with automatic cleanup
- **Production-ready** with Redis support option
- **Granular control** per endpoint type

## 🔄 Lifecycle Hooks

### Article Lifecycle (`src/api/article/content-types/article/lifecycles.ts`)

- **Automatic slug generation** from titles
- **SEO metadata generation**
- **Cache invalidation** on content changes
- **Cloudflare CDN integration** (optional)

### Author Lifecycle (`src/api/author/content-types/author/lifecycles.ts`)

- **Slug generation** from names
- **Profile optimization**
- **Content relationship management**

### Utility Functions (`src/utils/lifecycle-helpers.ts`)

Reusable functions for:
- SEO-friendly slug generation
- Plain text extraction from rich content
- Cache invalidation management
- Image processing utilities
- Content operation logging

## 🌍 Environment Configuration

### Development (`.env.example`)

```bash
NODE_ENV=development
DATABASE_CLIENT=sqlite
LOG_LEVEL=debug
RATE_LIMIT_MAX=100
```

### Production (`.env.production`)

```bash
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://...
UPLOAD_PROVIDER=strapi-provider-upload-strapi-cloud
IS_PROXIED=true
RATE_LIMIT_MAX=50
```

## 🚀 Deployment

### Automatic Deployment (`deploy.sh`)

The deployment script handles:

1. **Dependency installation** with frozen lockfile
2. **Admin panel build** with optimization
3. **Test execution** (optional)
4. **Git commit** with descriptive messages
5. **Strapi Cloud deployment** trigger

### Scripts (`package.json`)

```json
{
  "deploy": "./deploy.sh",
  "build:production": "NODE_ENV=production strapi build",
  "test:api": "node scripts/test-api.js",
  "clean": "rm -rf build .tmp/build"
}
```

## 🧪 Testing

### API Testing Script (`scripts/test-api.js`)

Comprehensive testing includes:

- **Endpoint availability** testing
- **Multi-language** content verification
- **Performance benchmarking**
- **Response time** monitoring
- **Success rate** calculation

Run tests: `pnpm run test:api`

## 📊 Performance Features

### Image Processing

- **Sharp integration** for high-performance image processing
- **Automatic compression** (85% JPEG quality, progressive)
- **Multiple format support** (JPEG, PNG, WebP)
- **Metadata preservation** for professional requirements

### Database Optimization

- **Connection pooling** with 20 concurrent connections
- **Query optimization** for model portfolio relations
- **Index suggestions** for common query patterns
- **Migration management** with rollback support

### Caching Strategy

- **CDN integration** ready (Cloudflare, AWS CloudFront)
- **Cache invalidation** on content updates
- **Tag-based caching** for granular control
- **Browser caching** headers configuration

## 🔒 Security Features

### Content Security Policy

```typescript
- 'img-src': Multiple domains for asset hosting
- 'media-src': Video platform integration
- 'frame-src': Safe external embed sources
- 'connect-src': API and external service access
```

### Rate Limiting

- **API protection** against abuse
- **Configurable limits** per endpoint
- **IP-based tracking** with automatic cleanup
- **Graceful degradation** under load

### File Upload Security

- **File type validation** with MIME checking
- **Size limits** enforced at multiple levels
- **Malicious file detection** (extensible)
- **Secure file storage** with proper permissions

## 🔧 Monitoring & Logging

### Production Logging

- **Structured logging** with timestamps
- **Performance metrics** collection
- **Error tracking** with stack traces
- **Content operation** audit trail

### Health Checks

- **API endpoint** availability monitoring
- **Database connection** status
- **File upload** system integrity
- **External service** dependency checks

## 🎯 Next Steps

### Recommended Integrations

1. **CDN Setup**: Configure Cloudflare or AWS CloudFront
2. **Monitoring**: Integrate Sentry or DataDog
3. **Email Service**: Configure SendGrid or AWS SES
4. **Analytics**: Add Google Analytics or similar
5. **Backup Strategy**: Implement automated database backups

### Performance Optimization

1. **Database Indexes**: Add indexes for common queries
2. **Redis Cache**: Implement Redis for session and cache storage
3. **Image CDN**: Move image serving to dedicated CDN
4. **API Optimization**: Implement GraphQL for complex queries

This infrastructure provides a solid foundation for a professional modeling agency CMS with room for future growth and optimization.