#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Find all JSON files excluding node_modules and tsconfig
function findJsonFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    if (item.isDirectory() && item.name !== 'node_modules') {
      files.push(...findJsonFiles(path.join(dir, item.name)));
    } else if (item.isFile() && item.name.endsWith('.json') && item.name !== 'tsconfig.json') {
      files.push(path.join(dir, item.name));
    }
  }
  
  return files;
}

console.log('🔍 Validating all JSON schema files...');

const jsonFiles = findJsonFiles(path.join(__dirname, '..', 'src'));
let valid = 0;
let invalid = 0;
const errors = [];

for (const file of jsonFiles) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    JSON.parse(content);
    console.log(`✅ ${path.relative(process.cwd(), file)}`);
    valid++;
  } catch (error) {
    console.log(`❌ ${path.relative(process.cwd(), file)}: ${error.message}`);
    errors.push({ file, error: error.message });
    invalid++;
  }
}

console.log(`\n📊 JSON Validation Results:`);
console.log(`✅ Valid files: ${valid}`);
console.log(`❌ Invalid files: ${invalid}`);

if (errors.length > 0) {
  console.log('\n🔥 Errors:');
  errors.forEach(({ file, error }) => {
    console.log(`  ${path.relative(process.cwd(), file)}: ${error}`);
  });
  process.exit(1);
} else {
  console.log('\n🎉 All JSON schemas are valid!');
  process.exit(0);
}