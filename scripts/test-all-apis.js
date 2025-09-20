#!/usr/bin/env node
'use strict';

const http = require('http');

async function testEndpoint(path, description) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 1337,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        let result = {
          endpoint: description,
          path: path,
          status: res.statusCode,
          success: res.statusCode === 200,
          details: ''
        };

        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            if (json.data) {
              if (Array.isArray(json.data)) {
                result.details = `${json.data.length} items`;
              } else {
                result.details = 'Data present';
              }
            }
          } catch (e) {
            result.details = 'Invalid JSON';
            result.success = false;
          }
        } else {
          try {
            const error = JSON.parse(data);
            result.details = error.error?.message || 'Unknown error';
          } catch {
            result.details = data.substring(0, 100);
          }
        }
        resolve(result);
      });
    });

    req.on('error', (error) => {
      resolve({
        endpoint: description,
        path: path,
        status: 0,
        success: false,
        details: error.message
      });
    });

    req.end();
  });
}

async function main() {
  console.log('\n🧪 Testing All Strapi API Endpoints\n');
  console.log('Make sure your Strapi server is running on http://localhost:1337\n');

  const endpoints = [
    // Homepage
    {
      path: '/api/homepage?populate[seo][populate][0]=shareImage&populate[sections][populate]=*&locale=en',
      description: 'Homepage'
    },

    // Models
    {
      path: '/api/models?populate=*&locale=en&publicationState=live&pagination[pageSize]=5',
      description: 'Models (list)'
    },
    {
      path: '/api/models?filters[slug][$eq]=elsa-hosk&populate=*&locale=en',
      description: 'Model by slug (Elsa Hosk)'
    },
    {
      path: '/api/models?filters[isFeatured][$eq]=true&populate=*&locale=en',
      description: 'Featured Models'
    },
    {
      path: '/api/models?filters[board][$eq]=women&populate=*&locale=en&pagination[pageSize]=5',
      description: 'Women Board Models'
    },

    // Articles
    {
      path: '/api/articles?populate[cover]=true&populate[author][populate][0]=avatar&populate[category]=true&locale=en&pagination[pageSize]=5',
      description: 'Articles (list)'
    },

    // Authors & Categories
    {
      path: '/api/authors?populate=avatar&locale=en',
      description: 'Authors'
    },
    {
      path: '/api/categories?locale=en',
      description: 'Categories'
    },

    // Photos
    {
      path: '/api/photos?populate=*&locale=en&pagination[pageSize]=5',
      description: 'Photos'
    },

    // Global settings
    {
      path: '/api/global?populate=*&locale=en',
      description: 'Global Settings'
    },

    // About page
    {
      path: '/api/about?populate=*&locale=en',
      description: 'About Page'
    }
  ];

  console.log('Testing ' + endpoints.length + ' endpoints...\n');

  const results = [];
  for (const endpoint of endpoints) {
    process.stdout.write(`Testing ${endpoint.description}... `);
    const result = await testEndpoint(endpoint.path, endpoint.description);
    results.push(result);

    if (result.success) {
      console.log(`✅ (${result.details})`);
    } else {
      console.log(`❌ (${result.status}: ${result.details})`);
    }
  }

  // Summary
  console.log('\n📊 Summary:\n');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`  ✅ ${successful} endpoints working`);
  if (failed > 0) {
    console.log(`  ❌ ${failed} endpoints failed`);

    console.log('\n⚠️  Failed endpoints:\n');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.endpoint}: ${r.details}`);
    });

    console.log('\n💡 Troubleshooting tips:');
    console.log('  1. Ensure all content is published: pnpm publish:all');
    console.log('  2. Check if content exists: pnpm seed:models:complete');
    console.log('  3. Restart Strapi: pnpm dev');
  } else {
    console.log('\n🎉 All API endpoints are working correctly!');
  }
}

main().catch(console.error);