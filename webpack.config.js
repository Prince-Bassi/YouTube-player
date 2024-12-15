require("dotenv").config();

const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
       mode: process.env.NODE_ENV,
       entry: ['webpack-hot-middleware/client', "./Scripts/script.jsx"],
       output: {
              path: path.resolve(__dirname, "ProjectFiles"),
              filename: "bundle.js",
              publicPath: '/',
       },
       module: {
              rules: [
              {
                     test: /\.(js|jsx)$/,
                     exclude: /node_modules/,
                     use: {
                            loader: "babel-loader",
                            options: {
                                   plugins: [
                                          process.env.NODE_ENV === 'development' && require('react-refresh/babel')
                                   ].filter(Boolean),
                                   cacheDirectory: true,
                            },
                     },
              },
              ],
       },
       resolve: {
              extensions: ['.js', '.jsx'],
       },
       plugins: [
              new HtmlWebpackPlugin({
                     template: './ProjectFiles/index.html',
              }),
              new ReactRefreshWebpackPlugin(),
              new webpack.HotModuleReplacementPlugin()
       ],
       devtool: 'cheap-module-source-map',
       devServer: {
              static: path.join(__dirname, "ProjectFiles"),
              compress: true,
              hot: true,
              historyApiFallback: true,
              port: 8080,
       },
};