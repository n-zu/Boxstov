const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.cjs");
const { InjectManifest } = require("workbox-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const WebpackObfuscator = require('webpack-obfuscator')
const { DefinePlugin } = require("webpack");

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
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/assets", to: "play/assets" },
        { from: "pwa", to: "play" },
        { from: "src/favicon.ico", to: "" },
      ],
    }),
    new DefinePlugin({
      "process.env.SERVER_URL": JSON.stringify("https://boxstov.fdelu.me"),
    }),
  ],
};

module.exports = merge(common, prod);
