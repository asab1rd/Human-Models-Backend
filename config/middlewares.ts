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
      origin: [
        'http://localhost:3000', // Next.js dev
        'http://localhost:3001', // Alternative dev port
        'https://humanparis.com', // Production domain
        'https://www.humanparis.com', // WWW variant
        'https://assets.humanparis.com', // CDN/Assets domain
        process.env.FRONTEND_URL, // Dynamic frontend URL
      ].filter(Boolean), // Remove undefined values
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
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
