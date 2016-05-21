var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var path = require('path');
webpackConfig.devtool = 'inline-source-map';
webpackConfig.isparta = {
    embedSource: true,
    noAutoWrap: true,
    // these babel options will be passed only to isparta and not to babel-loader
    babel: {
        presets: ['es2015', 'stage-0', 'react']
    }
};
webpackConfig.module.preLoaders = [{
    test: /\.js$/,
    exclude: [
        path.resolve('src/'),
        path.resolve('node_modules/')
    ],
    loader: 'babel'
}, {
    test: /\.js$/,
    include: path.resolve('src/'),
    loader: 'isparta'
}];
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
            'src/**/*.js': 'coverage',
            'tests.webpack.js': ['webpack', 'sourcemap']
        },

        reporters: ['progress', 'coverage'],

        coverageReporter: {
            type: 'html'
        },

        webpack: webpackConfig,

        webpackServer: {
            noInfo: true
        }

    });
};
