#!/usr/bin/env node
'use strict';

const http = require('http');

const endpoints = [
  '/api/models',
  '/api/homepage',
  '/api/navigation',
  '/api/footer',
  '/api/pages',
  '/api/photos',
  '/api/work-items',
  '/api/articles',
  '/api/categories',
  '/api/authors',
  '/api/global',
  '/api/about'
];

function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 1337,
      path: endpoint,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const status = res.statusCode === 200 ? '✅' : res.statusCode === 404 ? '❌' : '⚠️';
        console.log(`${status} ${endpoint} - Status: ${res.statusCode}`);
        resolve({ endpoint, status: res.statusCode });
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
      resolve({ endpoint, error: error.message });
    });

    req.end();
  });
}

async function testAllEndpoints() {
  console.log('🧪 Testing API Endpoints...\n');
  console.log('Make sure your Strapi server is running on http://localhost:1337\n');

  const results = [];
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
  }

  const working = results.filter(r => r.status === 200).length;
  const broken = results.filter(r => r.status === 404).length;
  const errors = results.filter(r => r.error).length;

  console.log('\n📊 Summary:');
  console.log(`   ✅ Working: ${working}`);
  console.log(`   ❌ 404 Not Found: ${broken}`);
  console.log(`   ⚠️  Errors: ${errors}`);

  if (broken > 0) {
    console.log('\n💡 If you see 404 errors, make sure to:');
    console.log('   1. Restart your Strapi server: pnpm dev');
    console.log('   2. Run the seed script: pnpm seed:models:complete');
  }
}

testAllEndpoints().catch(console.error);