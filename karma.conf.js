var webpack = require('webpack');
var path = require('path');
var APP_DIR = path.resolve(__dirname, 'src');

module.exports = function(config) {
    config.set({

        browsers: [process.env.CONTINUOUS_INTEGRATION ? 'Firefox' : 'Chrome'],

        singleRun: true,

        frameworks: ['mocha'],

        files: [
            './src/Select.js',
            'tests.webpack.js'
        ],

        preprocessors: {
            'tests.webpack.js': ['webpack', 'sourcemap']
        },

        reporters: ['dots'],

        webpack: {
            devtool: 'inline-source-map',
            module: {
                loaders: [{
                    test: /\.js$/,
                    include: APP_DIR,
                    loader: 'babel',
                    query: {
                        presets: ['es2015', 'stage-0', 'react']
                    }
                },{
                    test: /\.css$/, // Only .css files
                    loader: 'style!css' // Run both loaders
                }]
            },
            resolve: {
                // tell webpack to look for required files in bower and node
                modulesDirectories: [
                    'bower_components',
                    'node_modules'
                ],
            }
        },

        webpackServer: {
            noInfo: true
        }

    });
};
