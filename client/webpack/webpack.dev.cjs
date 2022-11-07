const { merge } = require("webpack-merge");
const common = require("./webpack.common.cjs");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const dev = {
  mode: "development",
  stats: "errors-warnings",
  devtool: "eval",
  devServer: {
    open: true,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/assets", to: "assets" },
        { from: "pwa", to: "" },
        { from: "src/favicon.ico", to: "" },
      ],
    }),
  ],
};

module.exports = merge(common, dev);
