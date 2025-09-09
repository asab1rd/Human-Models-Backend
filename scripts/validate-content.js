#!/usr/bin/env node

/**
 * CONTENT VALIDATION SUITE
 * Validates data integrity, SEO, and content quality
 */

const fetch = require('node-fetch');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_BASE = `${STRAPI_URL}/api`;

console.log('🔍 Human Paris CMS - Content Validation Suite');

/**
 * Check required fields are populated
 */
async function validateRequiredFields() {
  console.log('\\n📋 Validating Required Fields...');
  
  const validations = [
    {
      name: 'Models - Profile Data',
      url: '/models?populate[profileImage]=*&populate[measurements]=*',
      required: ['name', 'gender', 'board', 'profileImage'],
      warnings: ['measurements', 'bio']
    },
    {
      name: 'Photos - Metadata',
      url: '/photos?populate[image]=*',
      required: ['alt', 'category', 'image'],
      warnings: ['photographer', 'shootDate']
    },
    {
      name: 'Articles - Content',
      url: '/articles?populate[cover]=*&populate[author]=*',
      required: ['title', 'slug', 'author'],
      warnings: ['cover', 'description']
    }
  ];

  for (const validation of validations) {
    try {
      const response = await fetch(`${API_BASE}${validation.url}`);
      const data = await response.json();
      
      let requiredMissing = 0;
      let warningsMissing = 0;
      
      for (const item of data.data || []) {
        const attrs = item.attributes || item;
        
        // Check required fields
        for (const field of validation.required) {
          if (!attrs[field] || (typeof attrs[field] === 'object' && !attrs[field].data)) {
            requiredMissing++;
            break;
          }
        }
        
        // Check warning fields
        for (const field of validation.warnings) {
          if (!attrs[field]) {
            warningsMissing++;
            break;
          }
        }
      }
      
      console.log(`  ${validation.name}:`);
      console.log(`    ✅ Total items: ${data.data?.length || 0}`);
      
      if (requiredMissing > 0) {
        console.log(`    ❌ Missing required fields: ${requiredMissing} items`);
      } else {
        console.log(`    ✅ All required fields present`);
      }
      
      if (warningsMissing > 0) {
        console.log(`    ⚠️  Missing recommended fields: ${warningsMissing} items`);
      } else {
        console.log(`    ✅ All recommended fields present`);
      }
      
    } catch (error) {
      console.log(`  ❌ ${validation.name}: ${error.message}`);
    }
  }
}

/**
 * Validate SEO metadata completeness
 */
async function validateSEO() {
  console.log('\\n🔍 Validating SEO Metadata...');
  
  const seoValidations = [
    {
      name: 'Homepage SEO',
      url: '/homepage?populate[seo]=*',
      isSingle: true
    },
    {
      name: 'Pages SEO',
      url: '/pages?populate[seo]=*'
    },
    {
      name: 'Articles SEO',
      url: '/articles?populate[seo]=*'
    }
  ];

  for (const validation of seoValidations) {
    try {
      const response = await fetch(`${API_BASE}${validation.url}`);
      const data = await response.json();
      
      const items = validation.isSingle ? [data.data] : (data.data || []);
      let seoIssues = 0;
      
      for (const item of items) {
        const attrs = item?.attributes || item;
        const seo = attrs?.seo;
        
        if (!seo) {
          seoIssues++;
          continue;
        }
        
        // Check critical SEO fields
        const issues = [];
        if (!seo.metaTitle || seo.metaTitle.length < 10) issues.push('metaTitle too short');
        if (!seo.metaDescription || seo.metaDescription.length < 50) issues.push('metaDescription too short');
        if (seo.metaTitle && seo.metaTitle.length > 60) issues.push('metaTitle too long');
        if (seo.metaDescription && seo.metaDescription.length > 160) issues.push('metaDescription too long');
        
        if (issues.length > 0) seoIssues++;
      }
      
      console.log(`  ${validation.name}:`);
      console.log(`    ✅ Total items: ${items.length}`);
      
      if (seoIssues > 0) {
        console.log(`    ⚠️  SEO issues: ${seoIssues} items`);
      } else {
        console.log(`    ✅ All SEO metadata optimal`);
      }
      
    } catch (error) {
      console.log(`  ❌ ${validation.name}: ${error.message}`);
    }
  }
}

/**
 * Validate image assets
 */
async function validateImages() {
  console.log('\\n🖼️  Validating Image Assets...');
  
  const imageValidations = [
    {
      name: 'Model Profile Images',
      url: '/models?populate[profileImage]=*',
      imageField: 'profileImage'
    },
    {
      name: 'Photo Gallery Images',
      url: '/photos?populate[image]=*',
      imageField: 'image'
    },
    {
      name: 'Article Cover Images',
      url: '/articles?populate[cover]=*',
      imageField: 'cover'
    }
  ];

  for (const validation of imageValidations) {
    try {
      const response = await fetch(`${API_BASE}${validation.url}`);
      const data = await response.json();
      
      let missingImages = 0;
      let missingAltText = 0;
      let totalImages = 0;
      
      for (const item of data.data || []) {
        const attrs = item.attributes || item;
        const image = attrs[validation.imageField];
        
        if (!image || !image.data) {
          missingImages++;
        } else {
          totalImages++;
          // Check alt text for photos specifically
          if (validation.name === 'Photo Gallery Images' && !attrs.alt) {
            missingAltText++;
          }
        }
      }
      
      console.log(`  ${validation.name}:`);
      console.log(`    ✅ Total items: ${data.data?.length || 0}`);
      console.log(`    🖼️  With images: ${totalImages}`);
      
      if (missingImages > 0) {
        console.log(`    ⚠️  Missing images: ${missingImages} items`);
      }
      
      if (missingAltText > 0) {
        console.log(`    ⚠️  Missing alt text: ${missingAltText} images`);
      }
      
      if (missingImages === 0 && missingAltText === 0) {
        console.log(`    ✅ All images properly configured`);
      }
      
    } catch (error) {
      console.log(`  ❌ ${validation.name}: ${error.message}`);
    }
  }
}

/**
 * Validate relations integrity
 */
async function validateRelations() {
  console.log('\\n🔗 Validating Relations Integrity...');
  
  const relationValidations = [
    {
      name: 'Model → Photos Relation',
      url: '/models?populate[photos]=*',
      relationField: 'photos',
      expectedMin: 1
    },
    {
      name: 'Articles → Author Relation',
      url: '/articles?populate[author]=*',
      relationField: 'author',
      expectedMin: 1
    },
    {
      name: 'Photos → Model Relation',
      url: '/photos?populate[model]=*',
      relationField: 'model',
      expectedMin: 1
    }
  ];

  for (const validation of relationValidations) {
    try {
      const response = await fetch(`${API_BASE}${validation.url}`);
      const data = await response.json();
      
      let missingRelations = 0;
      let validRelations = 0;
      
      for (const item of data.data || []) {
        const attrs = item.attributes || item;
        const relation = attrs[validation.relationField];
        
        if (!relation || (relation.data && relation.data.length === 0)) {
          missingRelations++;
        } else {
          validRelations++;
        }
      }
      
      console.log(`  ${validation.name}:`);
      console.log(`    ✅ Valid relations: ${validRelations}`);
      
      if (missingRelations > 0) {
        console.log(`    ⚠️  Missing relations: ${missingRelations} items`);
      } else {
        console.log(`    ✅ All relations properly connected`);
      }
      
    } catch (error) {
      console.log(`  ❌ ${validation.name}: ${error.message}`);
    }
  }
}

/**
 * Validate i18n content completeness
 */
async function validateI18n() {
  console.log('\\n🌐 Validating i18n Completeness...');
  
  const i18nValidations = [
    'models',
    'articles', 
    'pages',
    'homepage',
    'navigation',
    'footer'
  ];

  for (const contentType of i18nValidations) {
    try {
      const isSingle = ['homepage', 'navigation', 'footer'].includes(contentType);
      
      const [enResponse, frResponse] = await Promise.all([
        fetch(`${API_BASE}/${contentType}?locale=en`),
        fetch(`${API_BASE}/${contentType}?locale=fr`)
      ]);
      
      if (enResponse.ok && frResponse.ok) {
        const enData = await enResponse.json();
        const frData = await frResponse.json();
        
        const enCount = isSingle ? 1 : (enData.data?.length || 0);
        const frCount = isSingle ? 1 : (frData.data?.length || 0);
        
        console.log(`  ${contentType}:`);
        console.log(`    🇬🇧 English: ${enCount} items`);
        console.log(`    🇫🇷 French: ${frCount} items`);
        
        if (Math.abs(enCount - frCount) > enCount * 0.2) { // Allow 20% difference
          console.log(`    ⚠️  Significant difference between locales`);
        } else {
          console.log(`    ✅ Good balance between locales`);
        }
      } else {
        console.log(`  ❌ ${contentType}: API error`);
      }
      
    } catch (error) {
      console.log(`  ❌ ${contentType}: ${error.message}`);
    }
  }
}

/**
 * Generate content quality report
 */
async function generateQualityReport() {
  console.log('\\n📊 Content Quality Report...');
  
  try {
    // Get overall statistics
    const stats = await Promise.all([
      fetch(`${API_BASE}/models`).then(r => r.json()),
      fetch(`${API_BASE}/photos`).then(r => r.json()),
      fetch(`${API_BASE}/articles`).then(r => r.json()),
      fetch(`${API_BASE}/work-items`).then(r => r.json()),
      fetch(`${API_BASE}/contact-submissions`).then(r => r.json())
    ]);

    console.log('  📈 Content Statistics:');
    console.log(`    👤 Models: ${stats[0].data?.length || 0}`);
    console.log(`    📸 Photos: ${stats[1].data?.length || 0}`);
    console.log(`    📰 Articles: ${stats[2].data?.length || 0}`);
    console.log(`    💼 Work Items: ${stats[3].data?.length || 0}`);
    console.log(`    📝 Submissions: ${stats[4].data?.length || 0}`);
    
    // Calculate ratios
    const modelCount = stats[0].data?.length || 0;
    const photoCount = stats[1].data?.length || 0;
    
    if (modelCount > 0) {
      console.log(`  📊 Portfolio Ratios:`);
      console.log(`    📸 Photos per model: ${Math.round((photoCount / modelCount) * 10) / 10}`);
      
      if (photoCount / modelCount < 5) {
        console.log(`    ⚠️  Consider adding more portfolio photos`);
      } else {
        console.log(`    ✅ Good portfolio coverage`);
      }
    }
    
  } catch (error) {
    console.log(`  ❌ Error generating report: ${error.message}`);
  }
}

/**
 * Main validation function
 */
async function main() {
  console.log('\\n🚀 Starting Content Validation...\\n');
  
  await validateRequiredFields();
  await validateSEO();
  await validateImages();
  await validateRelations();
  await validateI18n();
  await generateQualityReport();
  
  console.log('\\n✨ Content Validation Complete!');
  console.log('\\n💡 Recommendations:');
  console.log('  • Ensure all models have profile images and measurements');
  console.log('  • Add alt text to all photos for accessibility');
  console.log('  • Optimize SEO titles (10-60 chars) and descriptions (50-160 chars)');
  console.log('  • Maintain balance between English and French content');
  console.log('  • Aim for 5-10 portfolio photos per model');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { 
  validateRequiredFields, 
  validateSEO, 
  validateImages, 
  validateRelations, 
  validateI18n 
};