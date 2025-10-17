const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function main() {
  console.log('Starting Strapi...');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  try {
    // Find public role
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });

    if (!publicRole) {
      console.error('❌ Public role not found!');
      process.exit(1);
    }

    console.log(`✓ Found public role with ID: ${publicRole.id}\n`);

    // Define all permissions to create
    const permissions = [
      'api::article.article.find',
      'api::article.article.findOne',
      'api::category.category.find',
      'api::category.category.findOne',
      'api::author.author.find',
      'api::author.author.findOne',
      'api::global.global.find',
      'api::about.about.find',
      'api::homepage.homepage.find',
      'api::navigation.navigation.find',
      'api::footer.footer.find',
      'api::model.model.find',
      'api::model.model.findOne',
      'api::page.page.find',
      'api::page.page.findOne',
      'api::photo.photo.find',
      'api::photo.photo.findOne',
    ];

    let created = 0;
    let skipped = 0;

    for (const action of permissions) {
      // Check if exists
      const existing = await strapi.query('plugin::users-permissions.permission').findOne({
        where: {
          action,
          role: publicRole.id,
        },
      });

      if (existing) {
        console.log(`  [skip] ${action}`);
        skipped++;
      } else {
        await strapi.query('plugin::users-permissions.permission').create({
          data: {
            action,
            role: publicRole.id,
          },
        });
        console.log(`  [add]  ${action}`);
        created++;
      }
    }

    console.log(`\n✅ Done! Created ${created} permissions, skipped ${skipped} existing\n`);

    // Verify navigation and footer
    const navPerm = await strapi.query('plugin::users-permissions.permission').findOne({
      where: {
        action: 'api::navigation.navigation.find',
        role: publicRole.id,
      },
    });
    const footerPerm = await strapi.query('plugin::users-permissions.permission').findOne({
      where: {
        action: 'api::footer.footer.find',
        role: publicRole.id,
      },
    });

    console.log('Verification:');
    console.log(`  Navigation permission: ${navPerm ? '✓ EXISTS' : '✗ MISSING'}`);
    console.log(`  Footer permission: ${footerPerm ? '✓ EXISTS' : '✗ MISSING'}`);

  } catch (error) {
    console.error('Error:', error);
  }

  await app.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
