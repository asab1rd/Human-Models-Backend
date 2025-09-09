export default ({ env }) => ({
  'i18n': {
    enabled: true,
    config: {
      defaultLocale: 'en',
      locales: ['en', 'fr'],
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
    },
  },
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
  },
});
