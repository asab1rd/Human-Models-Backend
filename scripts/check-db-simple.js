'use strict';

async function checkDatabase() {
  console.log('\n📊 Database Content Check\n');
  console.log('=' .repeat(50));

  // Content types to check
  const contentTypes = [
    { name: 'model', displayName: 'Models' },
    { name: 'article', displayName: 'Articles' },
    { name: 'author', displayName: 'Authors' },
    { name: 'category', displayName: 'Categories' },
    { name: 'homepage', displayName: 'Homepage' },
    { name: 'navigation', displayName: 'Navigation' },
    { name: 'footer', displayName: 'Footer' },
    { name: 'page', displayName: 'Pages' },
    { name: 'photo', displayName: 'Photos' },
    { name: 'work-item', displayName: 'Work Items' },
    { name: 'global', displayName: 'Global Settings' },
    { name: 'about', displayName: 'About' }
  ];

  for (const contentType of contentTypes) {
    try {
      // Check if content type exists
      const api = strapi.documents(`api::${contentType.name}.${contentType.name}`);
      if (!api) {
        console.log(`⚠️  ${contentType.displayName}: Content type not found`);
        continue;
      }

      // Get count and sample data
      const items = await api.findMany({
        populate: '*',
        pagination: {
          limit: 5
        }
      });

      if (!items || items.length === 0) {
        console.log(`❌ ${contentType.displayName}: Empty (0 items)`);
      } else {
        console.log(`✅ ${contentType.displayName}: ${items.length} items`);

        // Show sample data for first item
        if (items[0]) {
          const sample = items[0];
          const fields = Object.keys(sample).filter(key =>
            !['id', 'createdAt', 'updatedAt', 'publishedAt', 'locale', 'documentId'].includes(key)
          ).slice(0, 3);

          console.log(`   Sample fields: ${fields.join(', ')}`);
        }
      }
    } catch (error) {
      console.log(`❌ ${contentType.displayName}: Error - ${error.message}`);
    }
  }

  console.log('\n' + '=' .repeat(50));
  console.log('✨ Check complete!\n');
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  try {
    const appContext = await compileStrapi();
    const app = await createStrapi(appContext).load();
    app.log.level = 'error';

    await checkDatabase();
    await app.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main().catch(console.error);