'use strict';

async function setPublicPermissions(newPermissions) {
  // Find the ID of the public role
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: {
      type: 'public',
    },
  });

  if (!publicRole) {
    console.error('Public role not found!');
    return;
  }

  console.log(`Found public role with ID: ${publicRole.id}`);

  // Create the new permissions and link them to the public role
  const allPermissionsToCreate = [];

  for (const controller of Object.keys(newPermissions)) {
    const actions = newPermissions[controller];

    for (const action of actions) {
      const permissionAction = `api::${controller}.${controller}.${action}`;

      // Check if permission already exists
      const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
        where: {
          action: permissionAction,
          role: publicRole.id,
        },
      });

      if (existingPermission) {
        console.log(`✓ Permission already exists: ${permissionAction}`);
      } else {
        console.log(`+ Creating permission: ${permissionAction}`);
        allPermissionsToCreate.push(
          strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: permissionAction,
              role: publicRole.id,
            },
          })
        );
      }
    }
  }

  await Promise.all(allPermissionsToCreate);
  console.log(`\n✅ Successfully created ${allPermissionsToCreate.length} new permissions`);
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  console.log('Starting Strapi...');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  console.log('Updating public permissions...\n');

  // Set public permissions for all content types
  await setPublicPermissions({
    article: ['find', 'findOne'],
    category: ['find', 'findOne'],
    author: ['find', 'findOne'],
    global: ['find', 'findOne'],
    about: ['find', 'findOne'],
    homepage: ['find'],
    navigation: ['find'],
    footer: ['find'],
    model: ['find', 'findOne'],
    page: ['find', 'findOne'],
    photo: ['find', 'findOne'],
  });

  console.log('\n✅ All permissions updated successfully!');
  console.log('You can now access these endpoints publicly.');

  await app.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error('Error updating permissions:', error);
  process.exit(1);
});
