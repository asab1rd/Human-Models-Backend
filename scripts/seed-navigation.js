const { join } = require('path');

async function seedNavigation() {
  try {
    const strapi = require('@strapi/strapi');
    const instance = await strapi().load();

    console.log('📢 Creating Navigation content...');

    // Create navigation for English
    const navigationDataEn = {
      logoAlt: 'Human Models Paris',
      menuItems: [
        {
          label: 'Women',
          url: '/directory/women',
          target: '_self'
        },
        {
          label: 'Men',
          url: '/directory/men',
          target: '_self'
        },
        {
          label: 'New Faces',
          url: '/directory/new-faces',
          target: '_self'
        },
        {
          label: 'Directory',
          url: '/directory',
          target: '_self'
        },
        {
          label: 'Journal',
          url: '/journal',
          target: '_self'
        }
      ],
      showSearch: true,
      showLanguageSwitch: true
    };

    // Create navigation for French
    const navigationDataFr = {
      logoAlt: 'Human Models Paris',
      menuItems: [
        {
          label: 'Femmes',
          url: '/directory/women',
          target: '_self'
        },
        {
          label: 'Hommes',
          url: '/directory/men',
          target: '_self'
        },
        {
          label: 'Nouveaux Visages',
          url: '/directory/new-faces',
          target: '_self'
        },
        {
          label: 'Répertoire',
          url: '/directory',
          target: '_self'
        },
        {
          label: 'Journal',
          url: '/journal',
          target: '_self'
        }
      ],
      showSearch: true,
      showLanguageSwitch: true
    };

    try {
      // Check if navigation already exists for English
      const existingNavEn = await strapi.db.query('api::navigation.navigation').findOne({
        where: { locale: 'en' }
      });

      if (!existingNavEn) {
        // Create English navigation
        await strapi.db.query('api::navigation.navigation').create({
          data: {
            ...navigationDataEn,
            locale: 'en'
          }
        });
        console.log('✅ Created English navigation');
      } else {
        // Update English navigation
        await strapi.db.query('api::navigation.navigation').update({
          where: { id: existingNavEn.id },
          data: navigationDataEn
        });
        console.log('✅ Updated English navigation');
      }

      // Check if navigation already exists for French
      const existingNavFr = await strapi.db.query('api::navigation.navigation').findOne({
        where: { locale: 'fr' }
      });

      if (!existingNavFr) {
        // Create French navigation
        await strapi.db.query('api::navigation.navigation').create({
          data: {
            ...navigationDataFr,
            locale: 'fr'
          }
        });
        console.log('✅ Created French navigation');
      } else {
        // Update French navigation
        await strapi.db.query('api::navigation.navigation').update({
          where: { id: existingNavFr.id },
          data: navigationDataFr
        });
        console.log('✅ Updated French navigation');
      }

    } catch (error) {
      console.error('❌ Error creating/updating navigation:', error.message);
    }

    console.log('✨ Navigation seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedNavigation();