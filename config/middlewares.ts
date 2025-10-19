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
      origin: function (origin: string, callback: (err: Error | null, allow?: boolean) => void) {
        // Allow requests with no origin (like mobile apps, Postman, or server-side)
        if (!origin) {
          return callback(null, true);
        }

        // Allowed domains
        const allowedOrigins = [
          'http://localhost:3000',
          'http://localhost:3001',
          'https://humanparis.com',
          'https://www.humanparis.com',
          'https://assets.humanparis.com',
          process.env.FRONTEND_URL,
        ].filter(Boolean);

        // Check exact match
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        // Allow all Vercel preview deployments (*.vercel.app)
        if (origin.endsWith('.vercel.app')) {
          return callback(null, true);
        }

        // Reject all other origins
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      },
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
