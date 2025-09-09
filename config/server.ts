export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', `http://localhost:${env.int('PORT', 1337)}`),
  proxy: env.bool('IS_PROXIED', false), // Set to true when behind reverse proxy
  app: {
    keys: env.array('APP_KEYS'),
  },
  // Enhanced settings for production deployment
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
