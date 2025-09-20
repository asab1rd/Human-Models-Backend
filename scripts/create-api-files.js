#!/usr/bin/env node
'use strict';

const fs = require('fs-extra');
const path = require('path');

// List of content types that need API files
const contentTypes = [
  'navigation',
  'footer',
  'page',
  'photo',
  'work-item',
  'contact-submission',
  'model-application'
];

// Template for router file
const routerTemplate = (name) => `/**
 * ${name} router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::${name}.${name}');`;

// Template for controller file
const controllerTemplate = (name) => `/**
 * ${name} controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::${name}.${name}');`;

// Template for service file
const serviceTemplate = (name) => `/**
 * ${name} service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::${name}.${name}');`;

async function createAPIFiles() {
  console.log('🚀 Creating missing API files...\n');

  for (const contentType of contentTypes) {
    const apiPath = path.join(__dirname, '..', 'src', 'api', contentType);

    // Create routes folder and file
    const routesPath = path.join(apiPath, 'routes');
    await fs.ensureDir(routesPath);
    const routerFile = path.join(routesPath, `${contentType}.ts`);
    if (!await fs.pathExists(routerFile)) {
      await fs.writeFile(routerFile, routerTemplate(contentType));
      console.log(`✅ Created router: ${contentType}/routes/${contentType}.ts`);
    } else {
      console.log(`⏭️  Router exists: ${contentType}/routes/${contentType}.ts`);
    }

    // Create controllers folder and file
    const controllersPath = path.join(apiPath, 'controllers');
    await fs.ensureDir(controllersPath);
    const controllerFile = path.join(controllersPath, `${contentType}.ts`);
    if (!await fs.pathExists(controllerFile)) {
      await fs.writeFile(controllerFile, controllerTemplate(contentType));
      console.log(`✅ Created controller: ${contentType}/controllers/${contentType}.ts`);
    } else {
      console.log(`⏭️  Controller exists: ${contentType}/controllers/${contentType}.ts`);
    }

    // Create services folder and file
    const servicesPath = path.join(apiPath, 'services');
    await fs.ensureDir(servicesPath);
    const serviceFile = path.join(servicesPath, `${contentType}.ts`);
    if (!await fs.pathExists(serviceFile)) {
      await fs.writeFile(serviceFile, serviceTemplate(contentType));
      console.log(`✅ Created service: ${contentType}/services/${contentType}.ts`);
    } else {
      console.log(`⏭️  Service exists: ${contentType}/services/${contentType}.ts`);
    }

    console.log(''); // Empty line between content types
  }

  console.log('✨ All API files created!');
  console.log('\n📝 Next steps:');
  console.log('   1. Restart your Strapi server: pnpm dev');
  console.log('   2. Test your API endpoints:');
  console.log('      - GET http://localhost:1337/api/models');
  console.log('      - GET http://localhost:1337/api/homepage');
  console.log('      - GET http://localhost:1337/api/navigation');
  console.log('      - GET http://localhost:1337/api/pages');
}

createAPIFiles().catch(console.error);