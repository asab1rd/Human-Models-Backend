#!/usr/bin/env node
'use strict';

const fs = require('fs-extra');
const path = require('path');

async function copyImagesFromFrontend() {
  console.log('🖼️  Copying real images from frontend...\n');

  const frontendImagesPath = path.join(__dirname, '../../human_paris/public/images');
  const backendUploadsPath = path.join(__dirname, '../data/uploads');

  // Ensure uploads directory exists
  await fs.ensureDir(backendUploadsPath);

  // Copy model images
  const modelsPath = path.join(frontendImagesPath, 'models');
  if (await fs.pathExists(modelsPath)) {
    console.log('📁 Copying model images...');

    const modelFolders = await fs.readdir(modelsPath);
    let totalImages = 0;

    for (const modelFolder of modelFolders) {
      if (modelFolder.startsWith('.')) continue; // Skip hidden files

      const modelSourcePath = path.join(modelsPath, modelFolder);
      const stats = await fs.stat(modelSourcePath);

      if (stats.isDirectory()) {
        const modelImages = await fs.readdir(modelSourcePath);

        for (const image of modelImages) {
          if (image.startsWith('.')) continue; // Skip hidden files

          const sourcePath = path.join(modelSourcePath, image);
          const destPath = path.join(backendUploadsPath, `${modelFolder}-${image.replace('.jpg', '')}.jpg`);

          await fs.copy(sourcePath, destPath, { overwrite: true });
          totalImages++;
        }

        console.log(`   ✅ Copied images for ${modelFolder}: ${modelImages.filter(img => !img.startsWith('.')).length} files`);
      }
    }

    console.log(`\n📸 Total model images copied: ${totalImages}`);
  }

  // Copy other static images we'll need
  const staticImages = [
    { source: 'logo.png', dest: 'logo.png' },
    { source: 'og-image.jpg', dest: 'og-image.jpg' },
    { source: 'favicon.png', dest: 'favicon.png' }
  ];

  console.log('\n📁 Copying static images...');
  for (const img of staticImages) {
    const sourcePath = path.join(frontendImagesPath, img.source);
    const destPath = path.join(backendUploadsPath, img.dest);

    if (await fs.pathExists(sourcePath)) {
      await fs.copy(sourcePath, destPath, { overwrite: true });
      console.log(`   ✅ ${img.dest}`);
    } else {
      // Create a placeholder if the file doesn't exist
      const placeholderPath = path.join(backendUploadsPath, 'placeholder.jpg');
      if (await fs.pathExists(placeholderPath)) {
        await fs.copy(placeholderPath, destPath);
        console.log(`   ⚠️  ${img.dest} (using placeholder)`);
      }
    }
  }

  // Create some additional placeholders for sections
  const sectionImages = [
    'hero-background.jpg',
    'women-board.jpg',
    'men-board.jpg',
    'new-faces-board.jpg',
    'about-hero.jpg',
    'become-hero.jpg',
    'legacy-1.jpg',
    'legacy-2.jpg',
    'legacy-3.jpg',
    'pfw-2024.jpg',
    'sustainable-fashion.jpg',
    'sophie-martin.jpg',
    'jean-luc-dubois.jpg'
  ];

  console.log('\n📁 Creating section image placeholders...');
  const placeholderPath = path.join(backendUploadsPath, 'placeholder.jpg');
  if (await fs.pathExists(placeholderPath)) {
    for (const img of sectionImages) {
      const destPath = path.join(backendUploadsPath, img);
      if (!await fs.pathExists(destPath)) {
        await fs.copy(placeholderPath, destPath);
      }
    }
    console.log(`   ✅ Created ${sectionImages.length} section placeholders`);
  }

  console.log('\n✨ Image copy complete!');
  console.log(`   📁 Images saved to: ${backendUploadsPath}`);
}

copyImagesFromFrontend().catch(console.error);