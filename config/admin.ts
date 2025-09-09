export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
    options: {
      expiresIn: '7d', // Extended for modeling agency admin workflow
    },
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  // Enhanced settings for modeling agency CMS
  url: env('ADMIN_URL', '/admin'),
  autoOpen: false, // Disable auto-open in production
  watchIgnoreFiles: [
    './src/**/*.test.js',
    './src/**/*.spec.js',
    './node_modules/**',
    '.tmp/**',
    'public/uploads/**', // Ignore uploads directory for performance
  ],
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  serveAdminPanel: env.bool('SERVE_ADMIN', true),
  // Security enhancements
  rateLimit: {
    max: env.int('RATE_LIMIT_MAX', 10), // Requests per minute
    duration: env.int('RATE_LIMIT_DURATION', 60000), // 1 minute
  },
  // File upload configurations for admin
  uploadLimits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});
