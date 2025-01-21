const path = require('path');

module.exports = function override(config, env) {
  config.devServer = {
    ...config.devServer,
    port: 3000,
    host: 'localhost',
    allowedHosts: ['localhost'],
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  };

  return config;
};
