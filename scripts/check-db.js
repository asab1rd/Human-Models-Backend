'use strict';

const chalk = require('chalk').default || require('chalk');

async function checkDatabase() {
  console.log(chalk.blue.bold('\n📊 Database Content Check\n'));
  console.log(chalk.gray('=' .repeat(50)));

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
        console.log(chalk.yellow(`⚠️  ${contentType.displayName}: Content type not found`));
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
        console.log(chalk.red(`❌ ${contentType.displayName}: Empty (0 items)`));
      } else {
        console.log(chalk.green(`✅ ${contentType.displayName}: ${items.length} items`));

        // Show sample data for first item
        if (items[0]) {
          const sample = items[0];
          const fields = Object.keys(sample).filter(key =>
            !['id', 'createdAt', 'updatedAt', 'publishedAt', 'locale', 'documentId'].includes(key)
          ).slice(0, 3);

          console.log(chalk.gray(`   Sample: ${fields.map(f => `${f}: ${JSON.stringify(sample[f]).substring(0, 50)}...`).join(', ')}`));
        }
      }
    } catch (error) {
      console.log(chalk.red(`❌ ${contentType.displayName}: Error - ${error.message}`));
    }
  }

  // Check public permissions
  console.log(chalk.gray('\n' + '=' .repeat(50)));
  console.log(chalk.blue.bold('🔒 Public Permissions\n'));

  try {
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
      populate: ['permissions']
    });

    if (publicRole && publicRole.permissions) {
      const apiPermissions = publicRole.permissions.filter(p => p.action.startsWith('api::'));
      const groupedPermissions = {};

      apiPermissions.forEach(p => {
        const [, contentType] = p.action.split('::')[1].split('.');
        if (!groupedPermissions[contentType]) {
          groupedPermissions[contentType] = [];
        }
        const action = p.action.split('.').pop();
        groupedPermissions[contentType].push(action);
      });

      Object.keys(groupedPermissions).forEach(contentType => {
        console.log(chalk.cyan(`   ${contentType}: ${groupedPermissions[contentType].join(', ')}`));
      });
    }
  } catch (error) {
    console.log(chalk.red(`   Error checking permissions: ${error.message}`));
  }

  console.log(chalk.gray('\n' + '=' .repeat(50)));
  console.log(chalk.blue.bold('✨ Check complete!\n'));
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
    console.error(chalk.red('Error:', error));
    process.exit(1);
  }
}

// Check if chalk is installed
try {
  require.resolve('chalk');
  main().catch(console.error);
} catch(e) {
  console.log('Installing chalk for better output...');
  require('child_process').execSync('pnpm add -D chalk', { stdio: 'inherit' });
  main().catch(console.error);
}