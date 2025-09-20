#!/usr/bin/env node
'use strict';

const http = require('http');

function testModelsEndpoint() {
  return new Promise((resolve) => {
    // Test with the populate structure the frontend uses
    const params = new URLSearchParams({
      'populate[profileImage]': 'true',
      'populate[portfolioImages]': 'true',
      'populate[measurements]': 'true',
      'populate[socials]': 'true',
      'populate[compCardPdf]': 'true',
      'populate[workExperience]': 'true',
      'populate[photos]': 'true',
      'locale': 'en',
      'publicationState': 'live',
      'sort': 'dateAdded:desc',
      'pagination[pageSize]': '20'
    });

    const options = {
      hostname: 'localhost',
      port: 1337,
      path: `/api/models?${params.toString()}`,
      method: 'GET'
    };

    console.log('🔗 Testing URL:', `http://${options.hostname}:${options.port}${options.path}\n`);

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Models API working!');

          try {
            const json = JSON.parse(data);
            if (json.data && json.data.length > 0) {
              console.log(`   ✅ Found ${json.data.length} models`);

              // Show first few models
              json.data.slice(0, 3).forEach((model, i) => {
                console.log(`      - ${model.name} (${model.board})`);
              });

              if (json.data.length > 3) {
                console.log(`      ... and ${json.data.length - 3} more`);
              }

              // Check if data is properly populated
              const firstModel = json.data[0];
              if (firstModel.profileImage) {
                console.log('   ✅ Profile images populated');
              }
              if (firstModel.measurements) {
                console.log('   ✅ Measurements populated');
              }
            } else {
              console.log('   ⚠️  No models found');
            }
          } catch (e) {
            console.log('   ⚠️  Could not parse response:', e.message);
          }
        } else {
          console.log(`❌ Models API returned status: ${res.statusCode}`);
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
  console.log('🧪 Testing Models API\n');
  console.log('Make sure your Strapi server is running on http://localhost:1337\n');

  await testModelsEndpoint();

  console.log('\n💡 If no models are found:');
  console.log('   1. Run: pnpm seed:models:complete');
  console.log('   2. Run: pnpm publish:all');
  console.log('   3. Restart Strapi: pnpm dev');
}

main().catch(console.error);