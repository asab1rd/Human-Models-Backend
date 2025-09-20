#!/usr/bin/env node
'use strict';

const fs = require('fs-extra');
const path = require('path');

// Create a simple placeholder image using a base64 encoded 1x1 pixel JPEG
const placeholderBase64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCADIAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9k=';

async function createPlaceholderImages() {
  console.log('🖼️  Creating placeholder images...\n');

  const uploadsDir = path.join(__dirname, '..', 'data', 'uploads');
  await fs.ensureDir(uploadsDir);

  // Create main placeholder
  const placeholderPath = path.join(uploadsDir, 'placeholder.jpg');
  const buffer = Buffer.from(placeholderBase64, 'base64');
  await fs.writeFile(placeholderPath, buffer);
  console.log('   ✅ Created: placeholder.jpg');

  // List of placeholder files to create (linking to the main placeholder)
  const placeholderFiles = [
    // Model profile images
    'elsa-hosk-profile.jpg',
    'nara-aziza-smith-profile.jpg',
    'olivia-ponton-profile.jpg',
    'clara-mcgregor-profile.jpg',
    'vinnie-hacker-profile.jpg',
    'jordan-barrett-profile.jpg',
    'anwar-hadid-profile.jpg',
    'gigi-hadid-profile.jpg',
    'bella-hadid-profile.jpg',
    'wisdom-kaye-profile.jpg',
    // Portfolio images
    'elsa-hosk-portfolio-1.jpg',
    'elsa-hosk-portfolio-2.jpg',
    'elsa-hosk-portfolio-3.jpg',
    'elsa-hosk-portfolio-4.jpg',
    'nara-aziza-smith-portfolio-1.jpg',
    'nara-aziza-smith-portfolio-2.jpg',
    'nara-aziza-smith-portfolio-3.jpg',
    'olivia-ponton-portfolio-1.jpg',
    'olivia-ponton-portfolio-2.jpg',
    'vinnie-hacker-portfolio-1.jpg',
    // Hero and section images
    'hero-background.jpg',
    'about-hero.jpg',
    'become-hero.jpg',
    'women-board.jpg',
    'men-board.jpg',
    'new-faces-board.jpg',
    // Gallery images
    'legacy-1.jpg',
    'legacy-2.jpg',
    'legacy-3.jpg',
    // Article covers
    'pfw-2024.jpg',
    'sustainable-fashion.jpg',
    // Author avatars
    'sophie-martin.jpg',
    'jean-luc-dubois.jpg',
    // Site images
    'logo.png',
    'og-image.jpg',
    'favicon.png'
  ];

  // Create symbolic links or copy the placeholder for each file
  for (const fileName of placeholderFiles) {
    const filePath = path.join(uploadsDir, fileName);
    try {
      // Copy the placeholder file
      await fs.copy(placeholderPath, filePath);
      console.log(`   ✅ Created placeholder: ${fileName}`);
    } catch (error) {
      console.log(`   ⚠️  Could not create ${fileName}: ${error.message}`);
    }
  }

  console.log(`\n✨ Created ${placeholderFiles.length + 1} placeholder images`);
  console.log('   These will be used when actual images are not available.');
  console.log('   Replace them with real images in: data/uploads/');
}

createPlaceholderImages().catch(console.error);