const webpack = require("webpack");
const path = require('path');

module.exports = {
    node: {
        fs: 'empty'
    },
    entry: {
        content_script: path.join(__dirname, 'src/content_script.ts'),
        vendor: ['jquery']
    },
    output: {
        path: path.join(__dirname, 'dist/js'),
        filename: '[name].js'
    },
    module: {
        loaders: [{
            exclude: /node_modules/,
            test: /\.tsx?$/,
            loader: 'ts-loader'
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
        }),

        // minify
        // new webpack.optimize.UglifyJsPlugin()
    ]
};