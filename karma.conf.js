var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
webpackConfig.devtool = 'inline-source-map';
var path = require('path');
var APP_DIR = path.resolve(__dirname, 'src');

module.exports = function(config) {
    config.set({

        browsers: [process.env.CONTINUOUS_INTEGRATION ? 'Firefox' : 'Chrome'],

        singleRun: true,

        frameworks: ['mocha'],

        files: [
            'tests.webpack.js'
        ],

        preprocessors: {
            'tests.webpack.js': ['webpack', 'sourcemap']
        },

        reporters: ['dots'],

        webpack: webpackConfig,

        webpackServer: {
            noInfo: true
        }

    });
};
