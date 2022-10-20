/* eslint-disable */
const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const { InjectManifest } = require("workbox-webpack-plugin");
// const WebpackObfuscator = require('webpack-obfuscator')

const prod = {
  mode: "production",
  stats: "errors-warnings",
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.js",
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          filename: "[name].bundle.js",
        },
      },
    },
  },
  plugins: [
    // disabled by default (uncomment to active)
    // new WebpackObfuscator(
    //   {
    //     rotateStringArray: true,
    //     stringArray: true,
    //     stringArrayThreshold: 0.75
    //   },
    //   ['vendors.*.js', 'sw.js']
    // ),
    new InjectManifest({
      swSrc: path.resolve(__dirname, "../pwa/sw.js"),
      swDest: "sw.js",
    }),
  ],
};

module.exports = merge(common, prod);
