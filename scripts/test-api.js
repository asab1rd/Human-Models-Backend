#!/usr/bin/env node

/**
 * COMPREHENSIVE API TESTING SUITE
 * Tests all endpoints with complex populate queries and i18n
 */

const fetch = require('node-fetch');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_BASE = `${STRAPI_URL}/api`;

console.log('🧪 Human Paris CMS - API Testing Suite');
console.log(`📡 Testing: ${STRAPI_URL}`);

// Test configuration
const tests = [
  // Content Type Tests - Basic
  {
    name: 'Models - Basic List',
    url: '/models',
    expectedFields: ['name', 'slug', 'gender', 'board'],
    locales: ['en', 'fr']
  },
  {
    name: 'Models - Full Populate',
    url: '/models?populate[profileImage]=*&populate[measurements]=*&populate[socials]=*&populate[photos]=*',
    expectedFields: ['name', 'profileImage', 'measurements'],
    locales: ['en', 'fr']
  },
  {
    name: 'Photos - With Model Relations',
    url: '/photos?populate[model]=*&populate[image]=*',
    expectedFields: ['alt', 'category', 'model', 'image'],
    locales: ['en', 'fr']
  },
  {
    name: 'Articles - Blog Content',
    url: '/articles?populate[cover]=*&populate[author]=*&populate[category]=*',
    expectedFields: ['title', 'slug', 'author'],
    locales: ['en', 'fr']
  },

  // Single Type Tests
  {
    name: 'Homepage - Dynamic Zones',
    url: '/homepage?populate[sections][populate]=*&populate[seo]=*',
    expectedFields: ['seo', 'sections'],
    locales: ['en', 'fr'],
    isSingle: true
  },
  {
    name: 'Navigation - Menu Structure',
    url: '/navigation?populate[menuItems][populate]=*&populate[ctaButton]=*&populate[logo]=*',
    expectedFields: ['menuItems', 'logo'],
    locales: ['en', 'fr'],
    isSingle: true
  },
  {
    name: 'Footer - Configuration',
    url: '/footer?populate[sections][populate]=*&populate[socialLinks]=*',
    expectedFields: ['sections', 'socialLinks'],
    locales: ['en', 'fr'],
    isSingle: true
  },

  // Advanced Queries
  {
    name: 'Models - Board Filtering',
    url: '/models?filters[board][$eq]=women&populate[profileImage]=*',
    expectedFields: ['board'],
    locales: ['en']
  },
  {
    name: 'Models - Featured Filter',
    url: '/models?filters[isFeatured][$eq]=true&populate[profileImage]=*',
    expectedFields: ['isFeatured'],
    locales: ['en']
  },
  {
    name: 'Photos - Category Filtering',
    url: '/photos?filters[category][$eq]=portfolio&populate[model]=*',
    expectedFields: ['category'],
    locales: ['en']
  },

  // Form Submissions
  {
    name: 'Contact Submissions',
    url: '/contact-submissions?sort[0]=submittedAt:desc',
    expectedFields: ['fullName', 'email', 'inquiryType'],
    locales: false
  },
  {
    name: 'Model Applications',
    url: '/model-applications?sort[0]=submittedAt:desc&populate[measurements]=*',
    expectedFields: ['firstName', 'lastName', 'measurements'],
    locales: false
  },

  // Work Items and Relations
  {
    name: 'Work Items - Full Relations',
    url: '/work-items?populate[models]=*&populate[images]=*&populate[credits]=*',
    expectedFields: ['title', 'client', 'models'],
    locales: ['en', 'fr']
  }
];

/**
 * Execute API test
 */
async function runTest(test) {
  const results = {
    name: test.name,
    passed: 0,
    failed: 0,
    errors: []
  };

  const locales = test.locales === false ? [null] : (test.locales || ['en']);

  for (const locale of locales) {
    try {
      const url = locale ? `${API_BASE}${test.url}&locale=${locale}` : `${API_BASE}${test.url}`;
      console.log(`🔍 Testing: ${test.name} ${locale ? `(${locale})` : ''}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validate response structure
      if (test.isSingle) {
        if (!data.data) {
          throw new Error('Single type response missing data field');
        }
        validateFields(data.data.attributes || data.data, test.expectedFields);
      } else {
        if (!data.data || !Array.isArray(data.data)) {
          throw new Error('Collection response missing data array');
        }
        
        if (data.data.length > 0) {
          validateFields(data.data[0].attributes || data.data[0], test.expectedFields);
        }
      }

      console.log(`  ✅ ${locale || 'no-locale'}: ${data.data?.length || 1} item(s)`);
      results.passed++;

    } catch (error) {
      console.log(`  ❌ ${locale || 'no-locale'}: ${error.message}`);
      results.failed++;
      results.errors.push(`${locale}: ${error.message}`);
    }
  }

  return results;
}

/**
 * Validate expected fields exist
 */
function validateFields(item, expectedFields) {
  for (const field of expectedFields) {
    if (!(field in item)) {
      throw new Error(`Missing expected field: ${field}`);
    }
  }
}

/**
 * Test performance
 */
async function testPerformance() {
  console.log('\\n⚡ Performance Testing...');
  
  const performanceTests = [
    {
      name: 'Homepage Load Time',
      url: `${API_BASE}/homepage?populate[sections][populate]=*&populate[seo]=*`
    },
    {
      name: 'Models Directory Load',
      url: `${API_BASE}/models?populate[profileImage]=*&pagination[pageSize]=20`
    },
    {
      name: 'Model Profile Full Load',
      url: `${API_BASE}/models?populate=*&pagination[pageSize]=1`
    }
  ];

  for (const test of performanceTests) {
    const startTime = Date.now();
    
    try {
      const response = await fetch(test.url);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (response.ok) {
        console.log(`  ✅ ${test.name}: ${duration}ms`);
      } else {
        console.log(`  ❌ ${test.name}: HTTP ${response.status} (${duration}ms)`);
      }
    } catch (error) {
      console.log(`  ❌ ${test.name}: ${error.message}`);
    }
  }
}

/**
 * Test i18n functionality
 */
async function testInternationalization() {
  console.log('\\n🌐 i18n Testing...');
  
  const i18nTests = [
    {
      content: 'models',
      field: 'bio'
    },
    {
      content: 'articles', 
      field: 'title'
    },
    {
      content: 'homepage',
      field: 'seo.metaTitle',
      isSingle: true
    }
  ];

  for (const test of i18nTests) {
    try {
      const enUrl = `${API_BASE}/${test.content}?locale=en&pagination[pageSize]=1`;
      const frUrl = `${API_BASE}/${test.content}?locale=fr&pagination[pageSize]=1`;

      const [enResponse, frResponse] = await Promise.all([
        fetch(enUrl),
        fetch(frUrl)
      ]);

      if (enResponse.ok && frResponse.ok) {
        const enData = await enResponse.json();
        const frData = await frResponse.json();
        
        const enContent = test.isSingle ? enData.data : enData.data[0];
        const frContent = test.isSingle ? frData.data : frData.data[0];
        
        if (enContent && frContent) {
          console.log(`  ✅ ${test.content}: Both locales available`);
        } else {
          console.log(`  ⚠️  ${test.content}: Missing content in one locale`);
        }
      } else {
        console.log(`  ❌ ${test.content}: API error`);
      }
    } catch (error) {
      console.log(`  ❌ ${test.content}: ${error.message}`);
    }
  }
}

/**
 * Main testing function
 */
async function main() {
  console.log('\\n🚀 Starting API Tests...\\n');
  
  let totalPassed = 0;
  let totalFailed = 0;
  const failedTests = [];

  // Run all tests
  for (const test of tests) {
    const result = await runTest(test);
    totalPassed += result.passed;
    totalFailed += result.failed;
    
    if (result.failed > 0) {
      failedTests.push(result);
    }
    
    console.log(''); // Space between tests
  }

  // Performance tests
  await testPerformance();
  
  // i18n tests
  await testInternationalization();

  // Summary
  console.log('\\n📊 Test Summary:');
  console.log(`✅ Passed: ${totalPassed}`);
  console.log(`❌ Failed: ${totalFailed}`);
  console.log(`📈 Success Rate: ${Math.round((totalPassed / (totalPassed + totalFailed)) * 100)}%`);

  if (failedTests.length > 0) {
    console.log('\\n🔥 Failed Tests:');
    failedTests.forEach(test => {
      console.log(`  - ${test.name}:`);
      test.errors.forEach(error => console.log(`    ${error}`));
    });
  }

  console.log('\\n✨ API Testing Complete!');
  
  // Exit with appropriate code
  process.exit(totalFailed > 0 ? 1 : 0);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { runTest, testPerformance, testInternationalization };