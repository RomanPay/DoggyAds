const path = require("path");

const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineScriptWebpackPlugin = require('html-inline-script-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const json = require('./src/assets/texture.json');

module.exports = {
    mode: 'development',
    entry: './src/app.ts',
    devtool: 'source-map',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Doggy Ads',
            minify: false,
        }),
        // new HtmlWebpackInlineScriptWebpackPlugin(),
        // new CopyPlugin({
        //     patterns: [{
        //         from: './src/assets',
        //         to: './assets',
        //     }],
        // }),
        new webpack.ProgressPlugin(),
    ],

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devServer: {
        host: 'localhost',
        port: 50000,
        open: true,
    },    
};
