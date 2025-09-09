#!/usr/bin/env node

/**
 * MIGRATION COMPLÈTE HUMAN PARIS → STRAPI 5 CMS
 *
 * Ce script migre TOUT le contenu depuis ../human_paris/src/lib/data/
 * vers le backend Strapi avec structure CMS complète
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_API_TOKEN) {
  console.error('❌ STRAPI_API_TOKEN requis dans .env');
  process.exit(1);
}

console.log('🚀 MIGRATION COMPLÈTE HUMAN PARIS → STRAPI CMS');
console.log(`📡 URL: ${STRAPI_URL}`);

// Client API Strapi 5
class StrapiClient {
  constructor(url, token) {
    this.baseUrl = url;
    this.token = token;
  }

  async request(endpoint, method = 'GET', data = null) {
    const url = `${this.baseUrl}/api${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };

    const options = { method, headers };
    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    console.log(`📤 ${method} ${endpoint}`);
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    return await response.json();
  }

  async get(endpoint) { return this.request(endpoint, 'GET'); }
  async post(endpoint, data) { return this.request(endpoint, 'POST', data); }
  async put(endpoint, data) { return this.request(endpoint, 'PUT', data); }
}

const strapi = new StrapiClient(STRAPI_URL, STRAPI_API_TOKEN);

/**
 * Upload d'images vers Strapi
 */
async function uploadImage(imagePath, fileName) {
  // Chemin vers les images du frontend
  const frontendImagePath = path.join(__dirname, '..', '..', 'human_paris', 'public', imagePath);

  if (!fs.existsSync(frontendImagePath)) {
    console.warn(`⚠️ Image non trouvée: ${frontendImagePath}`);
    return null;
  }

  const form = new FormData();
  form.append('files', fs.createReadStream(frontendImagePath), fileName);

  try {
    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      },
      body: form
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const result = await response.json();
    console.log(`✅ Image uploadée: ${fileName}`);
    return result[0];
  } catch (error) {
    console.error(`❌ Erreur upload ${fileName}:`, error.message);
    return null;
  }
}

/**
 * Charger les données mock depuis le frontend
 */
function loadMockData() {
  const modelsPath = path.join(__dirname, '..', '..', 'human_paris', 'src', 'lib', 'data', 'models.ts');
  const journalPath = path.join(__dirname, '..', '..', 'human_paris', 'src', 'lib', 'data', 'journal.ts');

  // Parser simple des fichiers TypeScript
  const modelsContent = fs.readFileSync(modelsPath, 'utf8');
  const journalContent = fs.readFileSync(journalPath, 'utf8');

  // Extraction basique (à améliorer avec un vrai parser)
  const models = extractExportFromTS(modelsContent, 'mockModelCards');
  const profiles = extractExportFromTS(modelsContent, 'mockModelProfiles');
  const articles = extractExportFromTS(journalContent, 'mockJournalPosts');

  return { models, profiles, articles };
}

function extractExportFromTS(content, exportName) {
  // Parser basique - à améliorer
  try {
    const regex = new RegExp(`export const ${exportName}[^=]*=([^;]+);`, 's');
    const match = content.match(regex);
    if (!match) return [];

    // Nettoyer et évaluer (dangereux mais pour migration seulement)
    let dataString = match[1].trim();
    dataString = dataString.replace(/: (ModelCard|ModelProfile|JournalPost|Author)\\[\\]/g, '');
    dataString = dataString.replace(/: Record<string, (ModelProfile|Author)>/g, '');

    return Function('"use strict"; return (' + dataString + ')')();
  } catch (error) {
    console.error(`Erreur parsing ${exportName}:`, error);
    return [];
  }
}

/**
 * Migration des auteurs
 */
async function migrateAuthors(articles) {
  console.log('\\n👥 Migration des auteurs...');
  const authors = {};
  const uniqueAuthors = {};

  articles.forEach(article => {
    if (article.author && !uniqueAuthors[article.author.id]) {
      uniqueAuthors[article.author.id] = article.author;
    }
  });

  for (const [authorId, authorData] of Object.entries(uniqueAuthors)) {
    // Version EN
    const authorEN = await strapi.post('/authors', {
      data: {
        name: authorData.name,
        bio: authorData.bio,
        locale: 'en'
      }
    });

    // Version FR
    const authorFR = await strapi.post('/authors', {
      data: {
        name: authorData.name,
        bio: translateText(authorData.bio),
        locale: 'fr'
      }
    });

    authors[authorId] = { en: authorEN.data.id, fr: authorFR.data.id };
    console.log(`✅ Auteur créé: ${authorData.name}`);
  }

  return authors;
}

/**
 * Migration des modèles avec toutes leurs photos
 */
async function migrateModels(models, profiles) {
  console.log('\\n🧑‍🦱 Migration des modèles...');
  const migratedModels = {};

  for (const model of models) {
    const profile = profiles[model.slug];
    if (!profile) continue;

    console.log(`\\n📸 Migration: ${model.name}`);

    // Upload profile image
    let profileImageId = null;
    if (model.thumbnail) {
      const profileImage = await uploadImage(model.thumbnail, `${model.slug}-profile.jpg`);
      profileImageId = profileImage?.id;
    }

    // Upload portfolio images
    const portfolioImageIds = [];
    if (profile.photos) {
      for (const photo of profile.photos) {
        const uploadedImage = await uploadImage(photo.url, `${model.slug}-${photo.id}.jpg`);
        if (uploadedImage) {
          portfolioImageIds.push(uploadedImage.id);

          // Créer entrée Photo (EN)
          await strapi.post('/photos', {
            data: {
              alt: photo.alt,
              title: `${model.name} - ${photo.category}`,
              category: photo.category,
              order: photo.order,
              image: uploadedImage.id,
              locale: 'en'
            }
          });

          // Créer entrée Photo (FR)
          await strapi.post('/photos', {
            data: {
              alt: translateText(photo.alt),
              title: `${model.name} - ${photo.category}`,
              category: photo.category,
              order: photo.order,
              image: uploadedImage.id,
              locale: 'fr'
            }
          });
        }
      }
    }

    // Créer modèle EN
    const modelEN = await strapi.post('/models', {
      data: {
        name: model.name,
        slug: model.slug,
        bio: profile.bio || '',
        gender: model.gender,
        nationality: model.nationality,
        city: model.city,
        board: model.board,
        isNew: model.isNew || false,
        isFeatured: Math.random() > 0.7, // 30% featured aléatoirement
        dateAdded: profile.dateAdded,
        profileImage: profileImageId,
        portfolioImages: portfolioImageIds,
        measurements: profile.measurements ? {
          height: profile.measurements.height,
          bust: profile.measurements.bust,
          waist: profile.measurements.waist,
          hips: profile.measurements.hips,
          shoes: profile.measurements.shoes,
          hair: profile.measurements.hair,
          eyes: profile.measurements.eyes
        } : null,
        socials: profile.socials || null,
        locale: 'en'
      }
    });

    // Créer modèle FR
    const modelFR = await strapi.post('/models', {
      data: {
        name: model.name,
        slug: model.slug + '-fr',
        bio: translateText(profile.bio || ''),
        gender: model.gender,
        nationality: model.nationality,
        city: model.city,
        board: model.board,
        isNew: model.isNew || false,
        isFeatured: modelEN.data.attributes.isFeatured,
        dateAdded: profile.dateAdded,
        profileImage: profileImageId,
        portfolioImages: portfolioImageIds,
        measurements: profile.measurements,
        socials: profile.socials,
        locale: 'fr'
      }
    });

    migratedModels[model.slug] = {
      en: modelEN.data.id,
      fr: modelFR.data.id
    };

    console.log(`✅ Modèle migré: ${model.name}`);

    // Pause pour éviter surcharge API
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return migratedModels;
}

/**
 * Migration des articles de journal
 */
async function migrateArticles(articles, authors) {
  console.log('\\n📰 Migration des articles...');

  for (const article of articles) {
    // Upload cover image si nécessaire
    let coverImageId = null;
    if (article.coverImage && !article.coverImage.includes('placeholder')) {
      const coverImage = await uploadImage(article.coverImage, `article-${article.slug}-cover.jpg`);
      coverImageId = coverImage?.id;
    }

    const authorId = authors[article.author.id]?.[article.locale] || authors[article.author.id]?.en;

    await strapi.post('/articles', {
      data: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        publishedAt: article.publishedAt,
        category: article.category,
        featured: article.featured,
        tags: article.tags,
        coverImage: coverImageId,
        author: authorId,
        locale: article.locale
      }
    });

    console.log(`✅ Article migré: ${article.title} (${article.locale})`);
  }
}

/**
 * Création des sections de landing page
 */
async function createLandingSections() {
  console.log('\\n🏠 Création des sections landing...');

  const sections = [
    // Hero Section
    {
      __component: 'sections.hero',
      title: 'Human Models Paris',
      subtitle: 'Discover Exceptional Talent',
      description: "Premier modeling agency representing the world's most promising faces in fashion, commercial, and editorial industries.",
      backgroundMedia: {
        mediaType: 'image',
        // Image sera uploadée séparément
      },
      ctaButtons: [
        {
          text: 'View Models',
          url: '/directory',
          style: 'primary',
          size: 'large'
        },
        {
          text: 'Book Talent',
          url: '/contact',
          style: 'outline',
          size: 'large'
        }
      ],
      textPosition: 'center',
      textColor: 'white',
      overlay: true,
      overlayOpacity: 40
    },

    // Featured Models Section
    {
      __component: 'sections.featured-models',
      title: 'Featured Talent',
      subtitle: 'Discover our most sought-after models',
      displayStyle: 'hero-grid',
      showBio: true,
      showMeasurements: false,
      autoRotate: false
    },

    // Latest Editorial Section
    {
      __component: 'sections.latest-editorial',
      title: 'Latest Editorial',
      subtitle: 'Behind the scenes and industry insights',
      articlesToShow: 6,
      categoryFilter: 'all',
      layout: 'featured-grid',
      showExcerpt: true,
      showAuthor: true,
      showDate: true
    },

    // Board Showcase Section
    {
      __component: 'sections.board-showcase',
      title: 'Our Boards',
      layout: 'horizontal',
      boards: [
        {
          boardType: 'women',
          title: 'Women',
          description: 'Elite female models for fashion, commercial, and editorial',
          linkText: 'View Women',
          linkUrl: '/directory/women'
        },
        {
          boardType: 'men',
          title: 'Men',
          description: 'Professional male models for all industries',
          linkText: 'View Men',
          linkUrl: '/directory/men'
        },
        {
          boardType: 'new-faces',
          title: 'New Faces',
          description: 'Fresh talent and emerging models',
          linkText: 'View New Faces',
          linkUrl: '/directory/new-faces'
        }
      ]
    }
  ];

  // Créer homepage avec sections EN
  await strapi.post('/homepage', {
    data: {
      seo: {
        metaTitle: 'Human Models Paris - Premier Modeling Agency',
        metaDescription: 'Discover exceptional modeling talent with Human Models Paris. Elite fashion models, commercial talent, and editorial stars.',
        keywords: 'modeling agency, paris, fashion models, commercial models, talent agency',
        preventIndexing: false
      },
      sections: sections,
      locale: 'en'
    }
  });

  // Version française
  const sectionsFR = sections.map(section => ({
    ...section,
    title: translateText(section.title),
    subtitle: translateText(section.subtitle),
    description: translateText(section.description)
  }));

  await strapi.post('/homepage', {
    data: {
      seo: {
        metaTitle: 'Human Models Paris - Agence de Mannequins Première',
        metaDescription: 'Découvrez des talents exceptionnels avec Human Models Paris. Mannequins mode, talents commerciaux et stars éditoriales.',
        keywords: 'agence mannequins, paris, modèles fashion, mannequins commerciaux, agence talent',
        preventIndexing: false
      },
      sections: sectionsFR,
      locale: 'fr'
    }
  });

  console.log('✅ Sections landing créées');
}

/**
 * Configuration navigation
 */
async function createNavigation() {
  console.log('\\n🧭 Configuration navigation...');

  const menuItems = [
    {
      label: 'Models',
      url: '/directory',
      order: 1,
      subMenuItems: [
        { label: 'All Models', url: '/directory', order: 1 },
        { label: 'Women', url: '/directory/women', order: 2 },
        { label: 'Men', url: '/directory/men', order: 3 },
        { label: 'New Faces', url: '/directory/new-faces', order: 4 }
      ]
    },
    {
      label: 'Journal',
      url: '/journal',
      order: 2
    },
    {
      label: 'Become a Model',
      url: '/become',
      order: 3
    },
    {
      label: 'Contact',
      url: '/contact',
      order: 4
    }
  ];

  // Navigation EN
  await strapi.post('/navigation', {
    data: {
      logoAlt: 'Human Models Paris',
      menuItems: menuItems,
      ctaButton: {
        text: 'Book Talent',
        url: '/contact',
        style: 'primary'
      },
      showSearch: true,
      showLanguageSwitch: true,
      locale: 'en'
    }
  });

  // Navigation FR
  await strapi.post('/navigation', {
    data: {
      logoAlt: 'Human Models Paris',
      menuItems: menuItems.map(item => ({
        ...item,
        label: translateText(item.label),
        subMenuItems: item.subMenuItems?.map(sub => ({
          ...sub,
          label: translateText(sub.label)
        }))
      })),
      ctaButton: {
        text: 'Réserver un Talent',
        url: '/contact',
        style: 'primary'
      },
      showSearch: true,
      showLanguageSwitch: true,
      locale: 'fr'
    }
  });

  console.log('✅ Navigation configurée');
}

/**
 * Traductions basiques (à améliorer avec service de traduction)
 */
function translateText(englishText) {
  if (!englishText) return '';

  const translations = {
    'Models': 'Mannequins',
    'All Models': 'Tous les Mannequins',
    'Women': 'Femmes',
    'Men': 'Hommes',
    'New Faces': 'Nouveaux Visages',
    'Journal': 'Journal',
    'Become a Model': 'Devenir Mannequin',
    'Contact': 'Contact',
    'View Models': 'Voir les Mannequins',
    'Book Talent': 'Réserver un Talent',
    'Featured Talent': 'Talents Vedettes',
    'Latest Editorial': 'Derniers Éditoriaux',
    'Our Boards': 'Nos Divisions',
    'Discover exceptional talent': 'Découvrez des talents exceptionnels',
    'Elite female models': 'Mannequins féminins élite',
    'Professional male models': 'Mannequins masculins professionnels',
    'Fresh talent': 'Talents émergents'
  };

  let translated = englishText;
  Object.entries(translations).forEach(([en, fr]) => {
    translated = translated.replace(new RegExp(en, 'gi'), fr);
  });

  return translated;
}

/**
 * Migration principale
 */
async function main() {
  try {
    // Test connexion
    await strapi.get('/models?pagination[pageSize]=1');
    console.log('✅ Connexion Strapi OK');

    // Charger données mock
    const { models, profiles, articles } = loadMockData();
    console.log(`📊 Données chargées: ${models.length} modèles, ${articles.length} articles`);

    // Migration en séquence
    const authors = await migrateAuthors(articles);
    const migratedModels = await migrateModels(models, profiles);
    await migrateArticles(articles, authors);
    await createLandingSections();
    await createNavigation();

    console.log('\\n🎉 MIGRATION COMPLÈTE TERMINÉE !');
    console.log('📝 Vérifiez dans l\'admin Strapi:');
    console.log(`   👤 ${models.length} Modèles`);
    console.log(`   📸 ~${models.length * 8} Photos`);
    console.log(`   📰 ${articles.length} Articles`);
    console.log(`   ✍️ ${Object.keys(authors).length} Auteurs`);
    console.log(`   🏠 1 Homepage avec sections dynamiques`);
    console.log(`   🧭 1 Navigation configurée`);

  } catch (error) {
    console.error('💥 Erreur migration:', error);
  }
}

// Exécution
if (require.main === module) {
  main();
}

module.exports = { main, migrateModels, migrateArticles };