var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
webpackConfig.devtool = 'inline-source-map';
var path = require('path');
var APP_DIR = path.resolve(__dirname, 'src');

module.exports = function(config) {
    config.set({

        //browsers: [process.env.CONTINUOUS_INTEGRATION ? 'Firefox' : 'Chrome'],
        browsers: ['PhantomJS'],

        singleRun: true,

        frameworks: ['mocha'],

        files: [
            'node_modules/es6-shim/es6-shim.min.js',
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
