export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'res.cloudinary.com', // for Cloudinary if used
            '*.strapi.io', // for Strapi Cloud assets
            'localhost:*', // for local development
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            '*.youtube.com',
            '*.vimeo.com',
            '*.instagram.com',
            '*.cdninstagram.com',
            'res.cloudinary.com',
            '*.strapi.io',
          ],
          'frame-src': [
            "'self'",
            '*.youtube.com',
            '*.vimeo.com',
            '*.instagram.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      // Use array with wildcard pattern for better Strapi Cloud compatibility
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://humanparis.com',
        'https://www.humanparis.com',
        'https://assets.humanparis.com',
        // Add specific Vercel domains
        'https://human-models.vercel.app',
        'https://human-models-git-main.vercel.app',
        /^https:\/\/.*\.vercel\.app$/, // Regex to allow all *.vercel.app domains
        process.env.FRONTEND_URL,
      ].filter(Boolean),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      // Ensure preflight requests are handled
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '100mb', // Allow large form uploads
      jsonLimit: '100mb',
      textLimit: '100mb',
      formidable: {
        maxFileSize: 100 * 1024 * 1024, // 100MB
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
