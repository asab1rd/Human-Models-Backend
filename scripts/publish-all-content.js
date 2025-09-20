#!/usr/bin/env node
'use strict';

async function publishAllContent() {
  console.log('📢 Publishing all draft content...\n');

  // Content types to publish
  const contentTypes = [
    { name: 'model', displayName: 'Models' },
    { name: 'homepage', displayName: 'Homepage' },
    { name: 'navigation', displayName: 'Navigation' },
    { name: 'footer', displayName: 'Footer' },
    { name: 'page', displayName: 'Pages' },
    { name: 'article', displayName: 'Articles' },
    { name: 'global', displayName: 'Global' },
    { name: 'about', displayName: 'About' }
  ];

  for (const contentType of contentTypes) {
    try {
      const api = strapi.documents(`api::${contentType.name}.${contentType.name}`);

      // Find all draft items
      const drafts = await api.findMany({
        status: 'draft',
        pagination: {
          limit: 100
        }
      });

      if (drafts && drafts.length > 0) {
        console.log(`📝 Found ${drafts.length} draft ${contentType.displayName}...`);

        // Publish each draft
        for (const draft of drafts) {
          try {
            await api.publish({
              documentId: draft.documentId,
              locale: draft.locale || 'en'
            });
            console.log(`   ✅ Published: ${draft.name || draft.title || draft.slug || draft.documentId}`);
          } catch (error) {
            console.log(`   ⚠️  Could not publish ${draft.documentId}: ${error.message}`);
          }
        }
      } else {
        // Check if already published
        const published = await api.findMany({
          status: 'published',
          pagination: { limit: 1 }
        });

        if (published && published.length > 0) {
          console.log(`✅ ${contentType.displayName}: Already published`);
        } else {
          console.log(`⚠️  ${contentType.displayName}: No content found`);
        }
      }
    } catch (error) {
      console.log(`❌ Error with ${contentType.displayName}: ${error.message}`);
    }
  }

  console.log('\n✨ Publishing complete!');
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  try {
    const appContext = await compileStrapi();
    const app = await createStrapi(appContext).load();
    app.log.level = 'error';

    await publishAllContent();
    await app.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main().catch(console.error);