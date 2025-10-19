// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: any }) {
    // Set public permissions for essential content types on startup
    await setPublicPermissions(strapi);
  },
};

/**
 * Set public read permissions for navigation, footer, and other public content
 * This ensures these endpoints are accessible without authentication
 */
async function setPublicPermissions(strapi: any) {
  try {
    console.log('🔐 Setting up public permissions...');

    // Get the public role
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({
        where: { type: 'public' },
      });

    if (!publicRole) {
      console.error('❌ Public role not found');
      return;
    }

    // Define permissions for single types that should be publicly readable
    const singleTypePermissions = [
      // Navigation - CRITICAL for frontend
      { controller: 'navigation', action: 'find' },

      // Footer - CRITICAL for frontend
      { controller: 'footer', action: 'find' },

      // Homepage
      { controller: 'homepage', action: 'find' },

      // Global settings
      { controller: 'global', action: 'find' },

      // About page
      { controller: 'about', action: 'find' },
    ];

    // Define permissions for collection types that should be publicly readable
    const collectionTypePermissions = [
      // Models - CRITICAL for directory
      { controller: 'model', action: 'find' },
      { controller: 'model', action: 'findOne' },

      // Work items
      { controller: 'work-item', action: 'find' },
      { controller: 'work-item', action: 'findOne' },

      // Model applications (only create for submissions)
      { controller: 'model-application', action: 'create' },

      // Pages
      { controller: 'page', action: 'find' },
      { controller: 'page', action: 'findOne' },
    ];

    // Get existing permissions
    const existingPermissions = await strapi
      .query('plugin::users-permissions.permission')
      .findMany({
        where: { role: publicRole.id },
      });

    // Helper function to check if permission exists
    const permissionExists = (controller: string, action: string) => {
      return existingPermissions.some(
        (p: any) => p.action === `api::${controller}.${controller}.${action}`
      );
    };

    let permissionsSet = 0;

    // Set single type permissions
    for (const perm of singleTypePermissions) {
      if (!permissionExists(perm.controller, perm.action)) {
        try {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: `api::${perm.controller}.${perm.controller}.${perm.action}`,
              role: publicRole.id,
              enabled: true,
            },
          });
          console.log(`✅ Enabled public ${perm.action} for ${perm.controller}`);
          permissionsSet++;
        } catch (error: any) {
          console.warn(`⚠️ Could not set permission for ${perm.controller}.${perm.action}:`, error.message);
        }
      }
    }

    // Set collection type permissions
    for (const perm of collectionTypePermissions) {
      if (!permissionExists(perm.controller, perm.action)) {
        try {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: `api::${perm.controller}.${perm.controller}.${perm.action}`,
              role: publicRole.id,
              enabled: true,
            },
          });
          console.log(`✅ Enabled public ${perm.action} for ${perm.controller}`);
          permissionsSet++;
        } catch (error: any) {
          console.warn(`⚠️ Could not set permission for ${perm.controller}.${perm.action}:`, error.message);
        }
      }
    }

    // Also enable upload permissions for file viewing
    const uploadPermissions = [
      { action: 'plugin::upload.content-api.find' },
      { action: 'plugin::upload.content-api.findOne' },
    ];

    const uploadPerms = await strapi
      .query('plugin::users-permissions.permission')
      .findMany({
        where: {
          role: publicRole.id,
          action: { $in: uploadPermissions.map((p) => p.action) },
        },
      });

    for (const perm of uploadPermissions) {
      const exists = uploadPerms.some((p: any) => p.action === perm.action);
      if (!exists) {
        try {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: perm.action,
              role: publicRole.id,
              enabled: true,
            },
          });
          console.log(`✅ Enabled public upload permission: ${perm.action}`);
          permissionsSet++;
        } catch (error: any) {
          console.warn(`⚠️ Could not set upload permission:`, error.message);
        }
      }
    }

    if (permissionsSet > 0) {
      console.log(`✅ Public permissions setup complete (${permissionsSet} new permissions set)`);
    } else {
      console.log('✅ All public permissions already configured');
    }
  } catch (error) {
    console.error('❌ Error setting up public permissions:', error);
  }
}
