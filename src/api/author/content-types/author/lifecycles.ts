/**
 * Lifecycle hooks for Author content type
 * Handles automatic slug generation and profile optimization
 */

import slugify from 'slugify';

export default {
  /**
   * Before creating an author
   */
  async beforeCreate(event: any) {
    const { data } = event.params;

    // Auto-generate slug from name if not provided
    if (data.name && !data.slug) {
      data.slug = slugify(data.name, {
        lower: true,
        strict: true,
      });
    }

    // Set default avatar if not provided
    if (!data.avatar && data.name) {
      // Could integrate with services like Gravatar or generate initials
      console.log(`👤 Author "${data.name}" created without avatar`);
    }
  },

  /**
   * Before updating an author
   */
  async beforeUpdate(event: any) {
    const { data } = event.params;

    // Update slug if name changed
    if (data.name && (!data.slug || data.slug === '')) {
      data.slug = slugify(data.name, {
        lower: true,
        strict: true,
      });
    }
  },

  /**
   * After creating an author
   */
  async afterCreate(event: any) {
    const { result } = event;
    
    console.log(`👤 New author created: "${result.name}" (ID: ${result.id})`);
  },

  /**
   * After updating an author
   */
  async afterUpdate(event: any) {
    const { result } = event;
    
    console.log(`👤 Author updated: "${result.name}" (ID: ${result.id})`);

    // Invalidate cache for author-related content
    if (process.env.NODE_ENV !== 'development') {
      // Could trigger cache invalidation for author pages and articles
      console.log(`🔄 Invalidating cache for author: ${result.slug}`);
    }
  },
};