/// <reference types="webpack" />

import * as webpack from 'webpack';
import * as path from 'path';
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin';
declare var __dirname;

const config: webpack.Configuration = {
    node: {
        fs: 'empty'
    },
    entry: {
        content_script: path.join(__dirname, 'src/content_script.ts'),
        vendor: ['jquery', 'jquery-binarytransport', 'parse-torrent']
    },
    output: {
        path: path.join(__dirname, 'dist/js'),
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: 'ts-loader'
        }, {
            test: require.resolve('jquery'),
            use: [{
                loader: 'expose-loader',
                options: 'jQuery'
            }, {
                loader: 'expose-loader',
                options: '$'
            }]
        }]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [

        // pack common vender files
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        })

    ]
};

module.exports = function (env) {
    env = env || {};

    if (env.release) {
        config.plugins.push(new UglifyJsPlugin({
            uglifyOptions: {
                compress: true,
                mangle: true
            }
        }));
    }
    return config;
}