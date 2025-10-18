export default ({ env }) => ({
  'i18n': {
    enabled: true,
    config: {
      defaultLocale: 'en',
      locales: ['en', 'fr'],
    },
  },
  'documentation': {
    enabled: true,
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Human Paris API',
        description: 'API documentation for Human Paris modeling agency CMS',
        termsOfService: 'https://humanparis.com/terms',
        contact: {
          name: 'API Support',
          email: 'api@humanparis.com'
        },
        license: {
          name: 'Private',
        },
      },
      'x-strapi-config': {
        // List of plugins to include in the documentation
        plugins: ['upload', 'users-permissions', 'i18n'],
        path: '/documentation',
      },
      security: [{ bearerAuth: [] }],
      servers: [
        { url: env('PUBLIC_URL', 'http://localhost:1337/api'), description: 'Development server' },
        { url: 'https://your-production-url.com/api', description: 'Production server' },
      ],
    },
  },
  'upload': {
    config: {
      sizeLimit: 100 * 1024 * 1024, // 100MB for professional photography
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        thumbnail: 150,
      },
      providerOptions: {
        localServer: {
          maxage: 300000, // 5 minutes cache
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
      // Sharp configuration for Strapi Cloud compatibility
      responsiveDimensions: true,
      // Configure Sharp with conservative settings for cloud environment
      sharp: {
        // Use sequential processing to reduce memory usage
        sequentialRead: true,
        // Limit concurrent operations
        concurrency: 1,
        // Conservative memory limits for cloud environment
        limitInputPixels: 268402689, // ~16384x16384 pixels
        // Ensure proper error handling
        failOnError: false,
        // Optimize for web delivery
        jpeg: {
          quality: 85,
          progressive: true,
          force: false,
        },
        png: {
          compressionLevel: 9,
          adaptiveFiltering: true,
          force: false,
        },
        webp: {
          quality: 85,
          force: false,
        },
        // Ensure thumbnails are always generated
        resize: {
          withoutEnlargement: true,
          fastShrinkOnLoad: true,
        },
      },
    },
  },
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
  },
});
