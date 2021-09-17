"use strict";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    main: path.resolve(__dirname, "src/js/main.js"),
    nav: path.resolve(__dirname, "src/js/nav.js"),
  },
  output: {
    assetModuleFilename: "img/[name].[contenthash][ext]",
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[contenthash].min.js",
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.(svgz?|png|jpe?g|gif)$/,
        type: "asset/resource",
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 2. extract css into files
          "css-loader", // 1. translate css into commonjs
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader, // 3. extract css into files
          "css-loader", // 2. turn css into commonjs
          "sass-loader", // 1. turn sass into css
        ],
      },
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader, // 3. extract css into files
          "css-loader", // 2. turn css into commonjs
          "less-loader", // 1. turn less into css
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
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
        chunks: ["main", "nav"],
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
      new HtmlWebpackPlugin({
        chunks: ["nav"],
        filename: "./impressum.html",
        template: path.resolve(__dirname, "src/impressum.raw.html"),
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
      new HtmlWebpackPlugin({
        chunks: ["nav"],
        filename: "./datenschutz.html",
        template: path.resolve(__dirname, "src/datenschutz.raw.html"),
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
            from: path.resolve(__dirname, "src/img/duene/*.jpg"),
            to: "img/duene/[name][ext]",
          },
          {
            from: path.resolve(__dirname, "src/img/moewe/*.jpg"),
            to: "img/moewe/[name][ext]",
          },
          {
            from: path.resolve(__dirname, "src/img/sellin/*opt*"),
            to: "img/sellin/[name][ext]",
          },
          {
            from: path.resolve(__dirname, "src/sitemap.xml"),
            to: "[name][ext]",
          },
          {
            from: path.resolve(__dirname, "src/robots.txt"),
            to: "[name][ext]",
          },
        ],
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].min.css",
    }),
    new CleanWebpackPlugin(),
  ],
  // By default webpack logs warnings if the bundle is bigger than 200kb.
  performance: { hints: false },
};
