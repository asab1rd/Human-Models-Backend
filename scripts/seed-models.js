'use strict';

const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');

// Import model agency data
const modelAgencyData = require('../data/model-agency-data.json');

async function seedModelAgency() {
  const shouldImportSeedData = await isFirstRun();

  if (shouldImportSeedData) {
    try {
      console.log('🚀 Setting up Human Models Paris database...');
      console.log('=' .repeat(50));
      await importModelAgencyData();
      console.log('=' .repeat(50));
      console.log('✅ Database setup complete!');
    } catch (error) {
      console.log('❌ Could not import seed data');
      console.error(error);
    }
  } else {
    console.log('⚠️  Seed data has already been imported.');
    console.log('   To reimport, clear your database first.');
  }
}

async function isFirstRun() {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: 'type',
    name: 'setup',
  });
  const initHasRun = await pluginStore.get({ key: 'modelAgencyInitHasRun' });
  await pluginStore.set({ key: 'modelAgencyInitHasRun', value: true });
  return !initHasRun;
}

async function setPublicPermissions(newPermissions) {
  // Find the ID of the public role
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: {
      type: 'public',
    },
  });

  // Create the new permissions and link them to the public role
  const allPermissionsToCreate = [];
  Object.keys(newPermissions).map((controller) => {
    const actions = newPermissions[controller];
    const permissionsToCreate = actions.map((action) => {
      return strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: `api::${controller}.${controller}.${action}`,
          role: publicRole.id,
        },
      });
    });
    allPermissionsToCreate.push(...permissionsToCreate);
  });
  await Promise.all(allPermissionsToCreate);
}

// Helper to create or get existing file
async function getOrCreateFile(fileName, alternativeText = null) {
  try {
    // Check if file exists in database
    const existingFile = await strapi.query('plugin::upload.file').findOne({
      where: {
        name: fileName.replace(/\.[^/.]+$/, ''), // Remove extension
      },
    });

    if (existingFile) {
      return existingFile;
    }

    // Check if physical file exists
    const filePath = path.join('data', 'uploads', fileName);
    if (!fs.existsSync(filePath)) {
      // Create a placeholder file if it doesn't exist
      const placeholderPath = path.join('data', 'uploads', 'placeholder.jpg');
      if (!fs.existsSync(placeholderPath)) {
        console.log(`   ⚠️  Using placeholder for missing file: ${fileName}`);
        return null; // Will use Strapi's default placeholder
      }
      // Use the placeholder
      fileName = 'placeholder.jpg';
    }

    // Upload the file
    const fileData = {
      filepath: path.join('data', 'uploads', fileName),
      originalFileName: fileName,
      size: 100000, // Placeholder size
      mimetype: mime.lookup(fileName) || 'image/jpeg',
    };

    const [uploadedFile] = await strapi
      .plugin('upload')
      .service('upload')
      .upload({
        files: fileData,
        data: {
          fileInfo: {
            alternativeText: alternativeText || `Image: ${fileName}`,
            caption: fileName.replace(/\.[^/.]+$/, ''),
            name: fileName.replace(/\.[^/.]+$/, ''),
          },
        },
      });

    return uploadedFile;
  } catch (error) {
    console.log(`   ⚠️  Could not process file ${fileName}: ${error.message}`);
    return null;
  }
}

// Import Models
async function importModels() {
  console.log('\n📸 Importing Models...');

  for (const modelData of modelAgencyData.models) {
    try {
      console.log(`   Adding model: ${modelData.name}`);

      // Process profile image
      const profileImage = await getOrCreateFile(
        modelData.profileImage,
        `${modelData.name} profile photo`
      );

      // Process portfolio images
      const portfolioImages = [];
      for (const imageName of modelData.portfolioImages || []) {
        const image = await getOrCreateFile(
          imageName,
          `${modelData.name} portfolio`
        );
        if (image) portfolioImages.push(image);
      }

      // Create measurements component data
      const measurements = modelData.measurements ? {
        height: modelData.measurements.height,
        shoes: modelData.measurements.shoes,
        hair: modelData.measurements.hair,
        eyes: modelData.measurements.eyes,
        bust: modelData.measurements.bust,
        chest: modelData.measurements.chest,
        waist: modelData.measurements.waist,
        hips: modelData.measurements.hips,
      } : null;

      // Create socials component data
      const socials = modelData.socials ? {
        instagram: modelData.socials.instagram,
        tiktok: modelData.socials.tiktok,
        twitter: modelData.socials.twitter,
        website: modelData.socials.website,
      } : null;

      // Create work experience components
      const workExperience = (modelData.workExperience || []).map(work => ({
        client: work.client,
        projectType: work.type,
        year: work.year,
        description: work.description,
      }));

      // Create the model
      await strapi.documents('api::model.model').create({
        data: {
          name: modelData.name,
          slug: modelData.slug,
          bio: modelData.bio,
          gender: modelData.gender,
          nationality: modelData.nationality,
          city: modelData.city,
          board: modelData.board,
          isNew: modelData.isNew || false,
          isFeatured: modelData.isFeatured || false,
          isAvailable: modelData.isAvailable !== false,
          dateAdded: modelData.dateAdded || new Date().toISOString().split('T')[0],
          profileImage: profileImage?.id,
          portfolioImages: portfolioImages.map(img => img.id),
          measurements,
          socials,
          workExperience,
          publishedAt: Date.now(),
        },
      });

      console.log(`   ✅ ${modelData.name} added successfully`);
    } catch (error) {
      console.error(`   ❌ Error adding model ${modelData.name}:`, error.message);
    }
  }
}

// Import Homepage
async function importHomepage() {
  console.log('\n🏠 Setting up Homepage...');

  try {
    const homepageData = modelAgencyData.homepage;

    // Process sections
    const sections = [];
    for (const section of homepageData.sections) {
      const processedSection = { ...section };

      // Process media in sections
      if (section.__component === 'sections.hero' && section.backgroundMedia) {
        const mediaBlock = {
          type: section.backgroundMedia.type,
          media: await getOrCreateFile(section.backgroundMedia.url),
          alt: section.backgroundMedia.alt,
        };
        processedSection.backgroundMedia = mediaBlock;
      }

      // Process board showcase images
      if (section.__component === 'sections.board-showcase' && section.boards) {
        processedSection.boards = [];
        for (const board of section.boards) {
          const boardItem = {
            title: board.name,
            slug: board.slug,
            description: board.description,
            image: await getOrCreateFile(board.image),
          };
          processedSection.boards.push(boardItem);
        }
      }

      sections.push(processedSection);
    }

    // Create homepage
    await strapi.documents('api::homepage.homepage').create({
      data: {
        seo: homepageData.seo,
        sections,
        publishedAt: Date.now(),
      },
    });

    console.log('   ✅ Homepage configured');
  } catch (error) {
    console.error('   ❌ Error setting up homepage:', error.message);
  }
}

// Import Navigation
async function importNavigation() {
  console.log('\n🧭 Setting up Navigation...');

  try {
    const navData = modelAgencyData.navigation;

    // Process logo
    const logo = await getOrCreateFile(navData.logo, 'Human Models Paris Logo');

    // Process menu items
    const menuItems = navData.menuItems.map(item => ({
      label: item.label,
      href: item.href,
      subItems: (item.subItems || []).map(sub => ({
        label: sub.label,
        href: sub.href,
      })),
    }));

    // Create navigation
    await strapi.documents('api::navigation.navigation').create({
      data: {
        logo: logo?.id,
        logoAlt: navData.logoAlt,
        menuItems,
        ctaButton: navData.ctaButton,
        showSearch: navData.showSearch,
        showLanguageSwitch: navData.showLanguageSwitch,
        publishedAt: Date.now(),
      },
    });

    console.log('   ✅ Navigation configured');
  } catch (error) {
    console.error('   ❌ Error setting up navigation:', error.message);
  }
}

// Import Footer
async function importFooter() {
  console.log('\n👟 Setting up Footer...');

  try {
    const footerData = modelAgencyData.footer;

    // Process logo
    const logo = await getOrCreateFile(footerData.logo, 'Footer Logo');

    // Process footer sections
    const sections = footerData.sections.map(section => ({
      title: section.title,
      links: section.links.map(link => ({
        label: link.label,
        href: link.href,
        isExternal: link.href.startsWith('http'),
      })),
    }));

    // Create footer
    await strapi.documents('api::footer.footer').create({
      data: {
        logo: logo?.id,
        description: footerData.description,
        sections,
        socialLinks: footerData.socialLinks,
        copyright: footerData.copyright,
        publishedAt: Date.now(),
      },
    });

    console.log('   ✅ Footer configured');
  } catch (error) {
    console.error('   ❌ Error setting up footer:', error.message);
  }
}

// Import Pages
async function importPages() {
  console.log('\n📄 Creating Pages...');

  for (const pageData of modelAgencyData.pages) {
    try {
      console.log(`   Creating page: ${pageData.title}`);

      // Process sections
      const sections = [];
      for (const section of pageData.sections) {
        const processedSection = { ...section };

        // Process media in sections
        if (section.__component === 'sections.hero' && section.backgroundMedia) {
          const mediaBlock = {
            type: section.backgroundMedia.type,
            media: await getOrCreateFile(section.backgroundMedia.url),
            alt: section.backgroundMedia.alt || '',
          };
          processedSection.backgroundMedia = mediaBlock;
        }

        // Process gallery images
        if (section.__component === 'sections.gallery' && section.images) {
          processedSection.images = [];
          for (const img of section.images) {
            const image = await getOrCreateFile(img.url);
            if (image) {
              processedSection.images.push({
                media: image.id,
                alt: img.alt,
              });
            }
          }
        }

        sections.push(processedSection);
      }

      // Create page
      await strapi.documents('api::page.page').create({
        data: {
          title: pageData.title,
          slug: pageData.slug,
          seo: pageData.seo,
          sections,
          showInNavigation: pageData.showInNavigation || false,
          navigationOrder: pageData.navigationOrder || 0,
          publishedAt: Date.now(),
        },
      });

      console.log(`   ✅ Page "${pageData.title}" created`);
    } catch (error) {
      console.error(`   ❌ Error creating page ${pageData.title}:`, error.message);
    }
  }
}

// Import Categories
async function importCategories() {
  console.log('\n🏷️  Creating Categories...');

  for (const category of modelAgencyData.categories) {
    try {
      await strapi.documents('api::category.category').create({
        data: {
          name: category.name,
          slug: category.slug,
        },
      });
      console.log(`   ✅ Category "${category.name}" created`);
    } catch (error) {
      console.error(`   ❌ Error creating category ${category.name}:`, error.message);
    }
  }
}

// Import Authors
async function importAuthors() {
  console.log('\n✍️  Creating Authors...');

  for (const author of modelAgencyData.authors) {
    try {
      const avatar = await getOrCreateFile(author.avatar, `${author.name} avatar`);

      await strapi.documents('api::author.author').create({
        data: {
          name: author.name,
          email: author.email,
          bio: author.bio,
          avatar: avatar?.id,
        },
      });
      console.log(`   ✅ Author "${author.name}" created`);
    } catch (error) {
      console.error(`   ❌ Error creating author ${author.name}:`, error.message);
    }
  }
}

// Import Articles
async function importArticles() {
  console.log('\n📰 Creating Articles...');

  for (const article of modelAgencyData.articles) {
    try {
      const cover = await getOrCreateFile(article.cover, article.title);

      // Find author and category
      const author = await strapi.documents('api::author.author').findFirst({
        filters: { name: article.author }
      });

      const category = await strapi.documents('api::category.category').findFirst({
        filters: { slug: article.category }
      });

      await strapi.documents('api::article.article').create({
        data: {
          title: article.title,
          slug: article.slug,
          description: article.description,
          cover: cover?.id,
          author: author?.id,
          category: category?.id,
          blocks: [
            {
              __component: 'shared.rich-text',
              body: article.content,
            }
          ],
          publishedAt: Date.now(),
        },
      });
      console.log(`   ✅ Article "${article.title}" created`);
    } catch (error) {
      console.error(`   ❌ Error creating article ${article.title}:`, error.message);
    }
  }
}

// Import Global Settings
async function importGlobal() {
  console.log('\n⚙️  Setting up Global Configuration...');

  try {
    const globalData = modelAgencyData.global;

    const favicon = await getOrCreateFile(globalData.favicon || 'favicon.png');
    const shareImage = await getOrCreateFile(globalData.defaultSeo?.shareImage || 'og-image.jpg');

    await strapi.documents('api::global.global').create({
      data: {
        siteName: globalData.siteName,
        siteDescription: globalData.siteDescription,
        favicon: favicon?.id,
        defaultSeo: {
          metaTitle: globalData.defaultSeo.metaTitle,
          metaDescription: globalData.defaultSeo.metaDescription,
          shareImage: shareImage?.id,
        },
        publishedAt: Date.now(),
      },
    });
    console.log('   ✅ Global settings configured');
  } catch (error) {
    console.error('   ❌ Error setting up global:', error.message);
  }
}

// Main import function
async function importModelAgencyData() {
  // Set public permissions
  await setPublicPermissions({
    model: ['find', 'findOne'],
    article: ['find', 'findOne'],
    category: ['find', 'findOne'],
    author: ['find', 'findOne'],
    global: ['find', 'findOne'],
    homepage: ['find', 'findOne'],
    navigation: ['find', 'findOne'],
    footer: ['find', 'findOne'],
    page: ['find', 'findOne'],
    photo: ['find', 'findOne'],
  });

  // Import all data
  await importGlobal();
  await importCategories();
  await importAuthors();
  await importModels();
  await importHomepage();
  await importNavigation();
  await importFooter();
  await importPages();
  await importArticles();
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  await seedModelAgency();
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});