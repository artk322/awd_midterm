const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        mapboxgl: 'mapbox-gl',
      }),
    ],
    devServer: {
      proxy: {
        '^/api': {
          target: 'http://api:26230',
          changeOrigin: true,
        },
      },
    },
  },
  pwa: {
    iconPaths: {
      faviconSVG: '/favicon.svg',
    },
  },
};
