var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public/dist');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
  entry: APP_DIR + '/App.js',
  output: {
    path: BUILD_DIR,
    filename: 'js/bundle.js'
  },
  module: {
      loaders: [
        {
            test: /\.js$/,
            include: APP_DIR,
            loader: 'babel',
            query: {
                presets: ['es2015', 'stage-0', 'react']
            }
        },
        {
            test: /\.css$/, // Only .css files
            loader: 'style!css' // Run both loaders
        },
      ]
  }
};

module.exports = config;
