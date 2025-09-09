/**
 * Custom middleware for file processing in Human Paris CMS
 * Handles image optimization, file validation, and upload processing
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export default (config: any, { strapi }: { strapi: any }) => {
  return async (ctx: any, next: any) => {
    // Only process file uploads
    if (ctx.request.url?.startsWith('/api/upload') && ctx.request.method === 'POST') {
      console.log('📁 Processing file upload...');
      
      try {
        // Continue with the upload process first
        await next();
        
        // Process the uploaded files after successful upload
        if (ctx.response.body && ctx.response.body.length > 0) {
          const uploadedFiles = Array.isArray(ctx.response.body) 
            ? ctx.response.body 
            : [ctx.response.body];
          
          for (const file of uploadedFiles) {
            await processUploadedFile(file, strapi);
          }
        }
      } catch (error) {
        console.error('❌ File processing error:', error);
        // Don't break the upload, just log the error
        await next();
      }
    } else {
      await next();
    }
  };
};

/**
 * Process individual uploaded files
 */
async function processUploadedFile(file: any, strapi: any) {
  if (!file || !file.url) return;
  
  const { url, mime, name, size } = file;
  
  console.log(`📸 Processing uploaded file: ${name} (${formatBytes(size)})`);
  
  // Only process images
  if (!mime.startsWith('image/')) {
    console.log(`📄 Skipping non-image file: ${name}`);
    return;
  }
  
  try {
    // Get file path
    const filePath = path.join(strapi.dirs.public, url);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File not found: ${filePath}`);
      return;
    }
    
    // Generate responsive image variants for modeling agency needs
    await generateImageVariants(filePath, file);
    
    // Extract and store image metadata
    const metadata = await extractImageMetadata(filePath);
    
    // Update file record with additional metadata
    await updateFileMetadata(file.id, metadata, strapi);
    
    console.log(`✅ Successfully processed: ${name}`);
  } catch (error) {
    console.error(`❌ Error processing file ${name}:`, error);
  }
}

/**
 * Generate responsive image variants
 */
async function generateImageVariants(filePath: string, file: any) {
  const baseDir = path.dirname(filePath);
  const baseName = path.basename(filePath, path.extname(filePath));
  const ext = path.extname(filePath);
  
  // Define breakpoints for modeling agency photos
  const breakpoints = [
    { suffix: '_thumbnail', width: 150, height: 150, fit: 'cover' as const },
    { suffix: '_small', width: 500, height: null, fit: 'inside' as const },
    { suffix: '_medium', width: 750, height: null, fit: 'inside' as const },
    { suffix: '_large', width: 1000, height: null, fit: 'inside' as const },
    { suffix: '_xlarge', width: 1920, height: null, fit: 'inside' as const },
  ];
  
  for (const breakpoint of breakpoints) {
    try {
      const outputPath = path.join(baseDir, `${baseName}${breakpoint.suffix}${ext}`);
      
      let sharpInstance = sharp(filePath);
      
      if (breakpoint.height) {
        sharpInstance = sharpInstance.resize(breakpoint.width, breakpoint.height, {
          fit: breakpoint.fit,
          position: 'center',
        });
      } else {
        sharpInstance = sharpInstance.resize(breakpoint.width, null, {
          fit: breakpoint.fit,
          withoutEnlargement: true,
        });
      }
      
      await sharpInstance
        .jpeg({ quality: 85, progressive: true })
        .toFile(outputPath);
        
      console.log(`📐 Generated ${breakpoint.suffix} variant (${breakpoint.width}px)`);
    } catch (error) {
      console.error(`❌ Error generating ${breakpoint.suffix} variant:`, error);
    }
  }
}

/**
 * Extract image metadata
 */
async function extractImageMetadata(filePath: string) {
  try {
    const metadata = await sharp(filePath).metadata();
    
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      channels: metadata.channels,
      density: metadata.density,
      hasAlpha: metadata.hasAlpha,
      orientation: metadata.orientation,
      colorSpace: metadata.space,
      processedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ Error extracting image metadata:', error);
    return {};
  }
}

/**
 * Update file record with metadata
 */
async function updateFileMetadata(fileId: number, metadata: any, strapi: any) {
  try {
    await strapi.db.query('plugin::upload.file').update({
      where: { id: fileId },
      data: {
        metadata: {
          ...metadata,
          processedForModelingAgency: true,
        },
      },
    });
  } catch (error) {
    console.error('❌ Error updating file metadata:', error);
  }
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}