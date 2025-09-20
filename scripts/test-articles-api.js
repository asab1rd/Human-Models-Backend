#!/usr/bin/env node
'use strict';

const http = require('http');

function testArticlesEndpoint() {
  return new Promise((resolve) => {
    // Test with the same populate structure the frontend uses
    const params = new URLSearchParams({
      'populate[cover]': 'true',
      'populate[author][populate][0]': 'avatar',
      'populate[category]': 'true',
      'populate[blocks][populate]': '*',
      'locale': 'en',
      'publicationState': 'live',
      'sort': 'publishedAt:desc',
      'pagination[pageSize]': '6'
    });

    const options = {
      hostname: 'localhost',
      port: 1337,
      path: `/api/articles?${params.toString()}`,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Articles API working with fixed populate structure');

          try {
            const json = JSON.parse(data);
            console.log(`   Found ${json.data?.length || 0} articles`);

            if (json.data?.[0]?.author) {
              console.log(`   ✅ Author data populated correctly`);
              if (json.data[0].author.avatar) {
                console.log(`   ✅ Author avatar field exists`);
              }
            }
          } catch (e) {
            console.log('   ⚠️  Could not parse response');
          }
        } else {
          console.log(`❌ Articles API returned status: ${res.statusCode}`);
          console.log('Response:', data.substring(0, 200));
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Request failed: ${error.message}`);
      resolve();
    });

    req.end();
  });
}

async function main() {
  console.log('🧪 Testing Articles API with Fixed Populate Query\n');
  console.log('Make sure your Strapi server is running on http://localhost:1337\n');

  await testArticlesEndpoint();

  console.log('\n💡 If you still see errors, try:');
  console.log('   1. Restart your Next.js dev server');
  console.log('   2. Clear Next.js cache: rm -rf .next');
  console.log('   3. Ensure Strapi is running: pnpm dev (in backend)');
}

main().catch(console.error);