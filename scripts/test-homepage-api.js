#!/usr/bin/env node
'use strict';

const http = require('http');

function testHomepageEndpoint() {
  return new Promise((resolve) => {
    // Test homepage with populate structure
    const params = new URLSearchParams({
      'populate[seo][populate][0]': 'shareImage',
      'populate[sections][populate]': '*',
      'locale': 'en'
    });

    const options = {
      hostname: 'localhost',
      port: 1337,
      path: `/api/homepage?${params.toString()}`,
      method: 'GET'
    };

    console.log('🔗 Testing URL:', `http://${options.hostname}:${options.port}${options.path}\n`);

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Homepage API working!');

          try {
            const json = JSON.parse(data);
            if (json.data) {
              console.log('   Homepage has data');
              if (json.data.sections && json.data.sections.length > 0) {
                console.log(`   ✅ Found ${json.data.sections.length} sections`);
                json.data.sections.forEach((section, i) => {
                  console.log(`      - Section ${i + 1}: ${section.__component || 'unknown'}`);
                });
              } else {
                console.log('   ⚠️  No sections found');
              }
            } else {
              console.log('   ⚠️  No data in response');
            }
          } catch (e) {
            console.log('   ⚠️  Could not parse response:', e.message);
          }
        } else {
          console.log(`❌ Homepage API returned status: ${res.statusCode}`);
          console.log('Response:', data.substring(0, 500));
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
  console.log('🧪 Testing Homepage API\n');
  console.log('Make sure your Strapi server is running on http://localhost:1337\n');

  await testHomepageEndpoint();

  console.log('\n💡 If you see errors:');
  console.log('   1. Ensure Strapi is running: pnpm dev');
  console.log('   2. Check if homepage content is published: pnpm publish:all');
  console.log('   3. Restart your Next.js dev server after fixes');
}

main().catch(console.error);