module.exports = ({ config }) => ({ ...config, android: { ...config.android, ...(process.env.GOOGLE_MAPS_API_KEY ? { config: { googleMaps: { apiKey: process.env.GOOGLE_MAPS_API_KEY } } } : {}) } });
