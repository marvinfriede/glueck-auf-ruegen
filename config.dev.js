// webpack.config.js

"use strict";

const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
  mode: "development",
  entry: {
    main: path.resolve(__dirname, "src/js/main.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    open: true,
    port: 8080,
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["html-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          //MiniCssExtractPlugin.loader, // 2. extract css into files
          "style-loader", // 2. inject styles into DOM
          "css-loader", // 1. translate css into commonjs
        ],
      },
      {
        test: /\.(svg|png|jpe?g|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            //name: "[name].[hash].[ext]",
            name(resourcePath, resourceQuery) {
            // resourcePath - /absolute/path/to/file.js
            // resourceQuery - ?foo=bar

            return resourcePath.substring(resourcePath.indexOf("src/img/") + 8, resourcePath.lastIndexOf(".")) + ".[ext]";
          	},
            outputPath: "img",
          },
        },
      },
      {
        test: /\.scss$/i,
        use: [
          // MiniCssExtractPlugin.loader, // 3. extract css into files
          "style-loader", // 3. inject styles into DOM
          "css-loader", // 2. turn css into commonjs
          "sass-loader" // 1. turn less into css
        ],
      },
      {
        test: /\.less$/i,
        use: [
          // MiniCssExtractPlugin.loader, // 3. extract css into files
          "style-loader", // 3. inject styles into DOM
          "css-loader", // 2. turn css into commonjs
          "less-loader" // 1. turn less into css
        ],
      },
    ],
  },
  plugins: [
    new HtmlPlugin({
      filename: "./index.html",
      template: path.resolve(__dirname, "src/index.raw.html"),
      inject: "head",
      scriptLoading: "defer",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/img/duene/*opt*"),
          to({ context, absoluteFilename }) {
            return "img/duene/[name].[ext]";
          },
        },
        {
          from: path.resolve(__dirname, "src/img/moewe/*opt*"),
          to({ context, absoluteFilename }) {
            return "img/moewe/[name].[ext]";
          },
        },
        {
          from: path.resolve(__dirname, "src/img/sellin/*opt*"),
          to({ context, absoluteFilename }) {
            return "img/sellin/[name].[ext]";
          },
        },
      ],
    }),
  ],
  // By default webpack logs warnings if the bundle is bigger than 200kb.
  performance: { hints: false },
  watch: false,
  watchOptions: {
    ignored: /node_modules/
  },
};