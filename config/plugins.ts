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
      // Completely disable automatic responsive image generation for Strapi Cloud
      // Strapi Cloud handles image optimization and resizing via its CDN
      // This prevents thumbnail upload errors
      responsiveDimensions: false,
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
    },
  },
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
  },
});
