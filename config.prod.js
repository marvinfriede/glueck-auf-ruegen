// webpack.config.js

"use strict";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const path = require('path');

module.exports = {
  mode: "production",
  entry: {
    main: path.resolve(__dirname, "src/js/main.js"),
  },
  output: {
    assetModuleFilename: "img/[name].[contenthash][ext]",
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[contenthash].js",
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 2. extract css into files
          "css-loader", // 1. translate css into commonjs
        ],
      },
      {
        test: /\.(svgz?|png|jpe?g|gif)$/,
        type: "asset/resource",
      },
      {
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader, // 3. extract css into files
          //"style-loader", // 3. inject styles into DOM
          "css-loader", // 2. turn css into commonjs
          "sass-loader" // 1. turn less into css
        ],
      },
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
          //"style-loader", // 3. inject styles into DOM
          "css-loader",
          "less-loader"
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
          toplevel: true,
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
      new HtmlWebpackPlugin({
        filename: "./index.html",
        template: path.resolve(__dirname, "src/index.raw.html"),
        inject: "head",
        minify: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          collapseInlineTagWhitespace: false,
          removeAttributeQuotes: true,
          removeComments: true,
          removeRedundantAttributes: true,
          sortAttributes: true,
          sortClassName: true,
        },
        scriptLoading: "defer",
      }),
      new CopyPlugin({
        patterns: [
          { 
            from: path.resolve(__dirname, "src/img/duene/*opt*"),
            to({ context, absoluteFilename }) {
              return "img/duene/[name][ext]";
            },
          },
          { 
            from: path.resolve(__dirname, "src/img/moewe/*opt*"),
            to({ context, absoluteFilename }) {
              return "img/moewe/[name][ext]";
            },
          },
          { 
            from: path.resolve(__dirname, "src/img/sellin/*opt*"),
            to({ context, absoluteFilename }) {
              return "img/sellin/[name][ext]";
            },
          },
          { 
            from: path.resolve(__dirname, "src/sitemap.xml"),
            to({ context, absoluteFilename }) {
              return "[name][ext]";
            },
          },
          { 
            from: path.resolve(__dirname, "src/robots.txt"),
            to({ context, absoluteFilename }) {
              return "[name][ext]";
            },
          },
        ],
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contentHash].css",
    }),
    new CleanWebpackPlugin(),
  ],
  // By default webpack logs warnings if the bundle is bigger than 200kb.
  performance: { hints: false },
};
