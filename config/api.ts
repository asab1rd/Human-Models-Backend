export default {
  rest: {
    defaultLimit: 25,
    maxLimit: 200, // Increased for model portfolio galleries
    withCount: true,
    prefix: '/api',
  },
  responses: {
    privateAttributes: ['created_at', 'updated_at', 'published_at'],
  },
  // Performance optimizations for modeling agency CMS
  pagination: {
    defaultLimit: 25,
    maxLimit: 200,
  },
  // Configure populate defaults for better performance
  populate: {
    defaultLimit: 100, // For model photos and relations
  },
};
