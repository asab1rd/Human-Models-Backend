/**
 * Lifecycle hooks for Article content type
 * Handles automatic slug generation, SEO optimization, and cache invalidation
 */

import slugify from 'slugify';

export default {
  /**
   * Before creating an article
   */
  async beforeCreate(event: any) {
    const { data } = event.params;

    // Auto-generate slug if not provided
    if (data.title && !data.slug) {
      data.slug = slugify(data.title, {
        lower: true,
        strict: true,
        locale: data.locale || 'en',
      });
    }

    // Set publishedAt if not in draft
    if (!data.publishedAt && data.draft !== true) {
      data.publishedAt = new Date();
    }
  },

  /**
   * Before updating an article
   */
  async beforeUpdate(event: any) {
    const { data } = event.params;

    // Update slug if title changed
    if (data.title && (!data.slug || data.slug === '')) {
      data.slug = slugify(data.title, {
        lower: true,
        strict: true,
        locale: data.locale || 'en',
      });
    }
  },

  /**
   * After creating an article
   */
  async afterCreate(event: any) {
    const { result } = event;
    
    console.log(`📰 New article created: "${result.title}" (ID: ${result.id})`);

    // Invalidate cache if CDN is configured
    await invalidateCache(['articles', 'homepage']);
  },

  /**
   * After updating an article
   */
  async afterUpdate(event: any) {
    const { result } = event;
    
    console.log(`📰 Article updated: "${result.title}" (ID: ${result.id})`);

    // Invalidate cache for updated content
    await invalidateCache(['articles', 'homepage', `article-${result.slug}`]);
  },

  /**
   * After deleting an article
   */
  async afterDelete(event: any) {
    const { result } = event;
    
    console.log(`📰 Article deleted: "${result.title}" (ID: ${result.id})`);

    // Invalidate cache after deletion
    await invalidateCache(['articles', 'homepage']);
  },
};

/**
 * Helper function to invalidate cache
 * Can be extended to work with CDN services like Cloudflare
 */
async function invalidateCache(tags: string[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔄 Cache invalidation triggered for tags: ${tags.join(', ')}`);
    return;
  }

  // Example implementation for Cloudflare (optional)
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
          body: JSON.stringify({
            tags: tags,
          }),
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
}