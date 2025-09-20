'use strict';

const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');

// Import complete model agency data
const modelAgencyData = require('../data/complete-model-agency-data.json');

async function seedModelAgency() {
  const shouldImportSeedData = await isFirstRun();

  if (shouldImportSeedData) {
    try {
      console.log('🚀 Setting up Human Models Paris database (COMPLETE)...');
      console.log('=' .repeat(60));
      await importModelAgencyData();
      console.log('=' .repeat(60));
      console.log('✅ Database setup complete with ALL models and content!');
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
  const initHasRun = await pluginStore.get({ key: 'completeModelAgencyInit' });
  await pluginStore.set({ key: 'completeModelAgencyInit', value: true });
  return !initHasRun;
}

async function setPublicPermissions(newPermissions) {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

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

// Helper to upload file
async function uploadFile(fileName, alternativeText = null) {
  try {
    // Check if file already exists in database
    const existingFile = await strapi.query('plugin::upload.file').findOne({
      where: {
        name: fileName.replace(/\.[^/.]+$/, '').replace(/-/g, ' '),
      },
    });

    if (existingFile) {
      console.log(`      ♻️  Reusing existing: ${fileName}`);
      return existingFile;
    }

    // Check if physical file exists
    const filePath = path.join('data', 'uploads', fileName);
    if (!fs.existsSync(filePath)) {
      console.log(`      ⚠️  File not found: ${fileName}`);
      return null;
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    const fileData = {
      filepath: filePath,
      originalFileName: fileName,
      size: stats.size,
      mimetype: mime.lookup(fileName) || 'image/jpeg',
    };

    const [uploadedFile] = await strapi
      .plugin('upload')
      .service('upload')
      .upload({
        files: fileData,
        data: {
          fileInfo: {
            alternativeText: alternativeText || fileName,
            caption: fileName.replace(/\.[^/.]+$/, '').replace(/-/g, ' '),
            name: fileName.replace(/\.[^/.]+$/, '').replace(/-/g, ' '),
          },
        },
      });

    console.log(`      ✅ Uploaded: ${fileName}`);
    return uploadedFile;
  } catch (error) {
    console.log(`      ❌ Upload failed ${fileName}: ${error.message}`);
    return null;
  }
}

// Import Models - ALL 20
async function importModels() {
  console.log('\n📸 Importing ALL 20 Models...');

  for (const [index, modelData] of modelAgencyData.models.entries()) {
    try {
      console.log(`\n   [${index + 1}/20] Processing: ${modelData.name}`);

      // Process profile image
      const profileImageName = modelData.profileImage.replace('/', '-');
      const profileImage = await uploadFile(profileImageName, `${modelData.name} profile photo`);

      // Process portfolio images
      const portfolioImages = [];
      for (const imageName of modelData.portfolioImages || []) {
        const fileName = imageName.replace('/', '-');
        const image = await uploadFile(fileName, `${modelData.name} portfolio`);
        if (image) portfolioImages.push(image);
      }

      // Create model
      const createdModel = await strapi.documents('api::model.model').create({
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
          measurements: modelData.measurements || null,
          socials: modelData.socials || null,
          workExperience: (modelData.workExperience || []).map(work => ({
            client: work.client,
            projectType: work.type || work.projectType,
            year: work.year,
            description: work.description,
          })),
          publishedAt: Date.now(),
        },
      });

      console.log(`   ✅ Model created: ${modelData.name} (ID: ${createdModel.documentId})`);
    } catch (error) {
      console.error(`   ❌ Error with model ${modelData.name}: ${error.message}`);
    }
  }

  console.log('\n✅ All models imported!');
}

// Import Homepage with VIDEO support
async function importHomepage() {
  console.log('\n🏠 Setting up Homepage with Video Hero...');

  try {
    const homepageData = modelAgencyData.homepage;

    // Get featured models for the featured section
    const featuredModels = await strapi.documents('api::model.model').findMany({
      filters: { isFeatured: true },
      limit: 8
    });

    // Process sections
    const sections = [];
    for (const section of homepageData.sections) {
      const processedSection = { ...section };

      // Hero section with VIDEO background
      if (section.__component === 'sections.hero' && section.backgroundMedia) {
        // Media block for video
        const mediaBlock = {
          mediaType: section.backgroundMedia.mediaType || "external-video",
          externalVideoUrl: section.backgroundMedia.externalVideoUrl,
          alt: section.backgroundMedia.alt || "Hero video",
        };
        processedSection.backgroundMedia = mediaBlock;
        console.log('   🎬 Added video background to hero section');
      }

      // Featured models section
      if (section.__component === 'sections.featured-models') {
        processedSection.models = featuredModels.map(m => m.id).slice(0, 8);
        console.log(`   👥 Added ${featuredModels.length} featured models`);
      }

      // Board showcase with images
      if (section.__component === 'sections.board-showcase' && section.boards) {
        processedSection.boards = [];
        for (const board of section.boards) {
          const imageFile = await uploadFile(board.image.imagePath || `${board.slug}-board.jpg`);
          const boardItem = {
            title: board.title,
            slug: board.slug,
            description: board.description,
            image: imageFile?.id || null,
          };
          processedSection.boards.push(boardItem);
        }
        console.log('   📋 Added board showcase sections');
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

    console.log('✅ Homepage created with video hero!');
  } catch (error) {
    console.error('❌ Homepage error:', error.message);
  }
}

// Import Navigation (Fixed structure)
async function importNavigation() {
  console.log('\n🧭 Setting up Navigation...');

  try {
    const navData = modelAgencyData.navigation;
    const logo = await uploadFile('logo.png', 'Human Models Paris Logo');

    // Simplified menu items structure
    const menuItems = navData.menuItems.map(item => ({
      label: item.label,
      href: item.href,
      subItems: (item.subItems || []).map(sub => ({
        label: sub.label,
        href: sub.href,
      })),
    }));

    await strapi.documents('api::navigation.navigation').create({
      data: {
        logo: logo?.id,
        logoAlt: navData.logoAlt,
        menuItems,
        ctaButton: {
          text: navData.ctaButton?.text || "Book Models",
          href: navData.ctaButton?.href || "/contact",
          variant: navData.ctaButton?.variant || "primary"
        },
        showSearch: navData.showSearch !== false,
        showLanguageSwitch: navData.showLanguageSwitch !== false,
        publishedAt: Date.now(),
      },
    });

    console.log('✅ Navigation configured');
  } catch (error) {
    console.error('❌ Navigation error:', error.message);
  }
}

// Import Footer (Fixed structure)
async function importFooter() {
  console.log('\n👟 Setting up Footer...');

  try {
    const footerData = modelAgencyData.footer;
    const logo = await uploadFile('logo.png', 'Footer Logo');

    // Fixed footer sections structure
    const sections = footerData.sections.map(section => ({
      title: section.title,
      links: section.links.map(link => ({
        label: link.label,
        href: link.href,
        isExternal: link.href?.startsWith('http') || false,
      })),
    }));

    await strapi.documents('api::footer.footer').create({
      data: {
        logo: logo?.id,
        description: footerData.description,
        sections,
        socialLinks: (footerData.socialLinks || []).map(social => ({
          platform: social.platform,
          url: social.url,
        })),
        copyright: footerData.copyright || "© 2024 Human Models Paris. All rights reserved.",
        publishedAt: Date.now(),
      },
    });

    console.log('✅ Footer configured');
  } catch (error) {
    console.error('❌ Footer error:', error.message);
  }
}

// Import Pages
async function importPages() {
  console.log('\n📄 Creating Pages...');

  for (const pageData of modelAgencyData.pages) {
    try {
      console.log(`   Creating: ${pageData.title}`);

      // Process sections
      const sections = [];
      for (const section of pageData.sections) {
        const processedSection = { ...section };

        // Process media in hero sections
        if (section.__component === 'sections.hero' && section.backgroundMedia) {
          const mediaFile = await uploadFile(section.backgroundMedia.url);
          const mediaBlock = {
            mediaType: section.backgroundMedia.type || "image",
            image: mediaFile?.id,
            alt: section.backgroundMedia.alt || '',
          };
          processedSection.backgroundMedia = mediaBlock;
        }

        // Process gallery images
        if (section.__component === 'sections.gallery' && section.images) {
          processedSection.images = [];
          for (const img of section.images) {
            const image = await uploadFile(img.url);
            if (image) {
              processedSection.images.push({
                media: image.id,
                alt: img.alt,
              });
            }
          }
        }

        // Fix form type
        if (section.__component === 'sections.form') {
          processedSection.formType = section.formType || 'contact';
        }

        sections.push(processedSection);
      }

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

      console.log(`   ✅ Page created: ${pageData.title}`);
    } catch (error) {
      console.error(`   ❌ Page error ${pageData.title}: ${error.message}`);
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
      console.log(`   ✅ ${category.name}`);
    } catch (error) {
      console.error(`   ❌ Category error ${category.name}: ${error.message}`);
    }
  }
}

// Import Authors
async function importAuthors() {
  console.log('\n✍️  Creating Authors...');

  for (const author of modelAgencyData.authors) {
    try {
      const avatar = await uploadFile(author.avatar, `${author.name} avatar`);

      await strapi.documents('api::author.author').create({
        data: {
          name: author.name,
          email: author.email,
          bio: author.bio,
          avatar: avatar?.id,
        },
      });
      console.log(`   ✅ ${author.name}`);
    } catch (error) {
      console.error(`   ❌ Author error ${author.name}: ${error.message}`);
    }
  }
}

// Import Articles
async function importArticles() {
  console.log('\n📰 Creating Articles...');

  for (const article of modelAgencyData.articles) {
    try {
      const cover = await uploadFile(article.cover, article.title);

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
      console.log(`   ✅ ${article.title}`);
    } catch (error) {
      console.error(`   ❌ Article error ${article.title}: ${error.message}`);
    }
  }
}

// Import Global Settings
async function importGlobal() {
  console.log('\n⚙️  Setting up Global Configuration...');

  try {
    const globalData = modelAgencyData.global;

    const favicon = await uploadFile('favicon.png', 'Favicon');
    const shareImage = await uploadFile('og-image.jpg', 'Share Image');

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
    console.log('✅ Global settings configured');
  } catch (error) {
    console.error('❌ Global error:', error.message);
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

  // Import all data in order
  await importGlobal();
  await importCategories();
  await importAuthors();
  await importModels(); // ALL 20 models
  await importHomepage(); // With video
  await importNavigation();
  await importFooter();
  await importPages();
  await importArticles();

  console.log('\n📊 Import Summary:');
  console.log('   • 20 Models imported with real images');
  console.log('   • Homepage with video hero section');
  console.log('   • Navigation & Footer configured');
  console.log('   • All pages and content created');
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