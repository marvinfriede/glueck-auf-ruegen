"use strict";

const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: path.resolve(__dirname, "src/js/main.js"),
    nav: path.resolve(__dirname, "src/js/nav.js"),
  },
  output: {
    assetModuleFilename: "img/[name].[contenthash][ext]",
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    open: true,
    port: 8080,
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: ["html-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.(svgz?|png|jpe?g|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader", // 2. inject styles into DOM
          "css-loader", // 1. translate css into commonjs
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader", // 3. inject styles into DOM
          "css-loader", // 2. turn css into commonjs
          "sass-loader", // 1. turn sass into css
        ],
      },
    ],
  },
  plugins: [
    new HtmlPlugin({
      chunks: ["main", "nav"],
      filename: "./index.html",
      inject: "head",
      scriptLoading: "defer",
      template: path.resolve(__dirname, "src/index.raw.html"),
    }),
    new HtmlPlugin({
      chunks: ["nav"],
      filename: "./impressum.html",
      inject: "head",
      scriptLoading: "defer",
      template: path.resolve(__dirname, "src/impressum.raw.html"),
    }),
    new HtmlPlugin({
      chunks: ["nav"],
      filename: "./datenschutz.html",
      inject: "head",
      scriptLoading: "defer",
      template: path.resolve(__dirname, "src/datenschutz.raw.html"),
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
      ],
    }),
    new DashboardPlugin(),
  ],
  // By default webpack logs warnings if the bundle is bigger than 200kb.
  performance: { hints: false },
  watch: false,
  watchOptions: {
    ignored: /node_modules/,
  },
};
