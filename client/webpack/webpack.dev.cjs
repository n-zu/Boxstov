const { merge } = require("webpack-merge");
const common = require("./webpack.common.cjs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { DefinePlugin } = require("webpack");

const dev = {
  mode: "development",
  stats: "errors-warnings",
  devtool: "eval",
  devServer: {
    open: true,
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/assets", to: "assets" },
        { from: "src/html", to: "html" },
        { from: "pwa", to: "" },
        { from: "src/favicon.ico", to: "" },
      ],
    }),
    new DefinePlugin({
      "process.env.SERVER_URL": JSON.stringify("http://127.0.0.1"),
    }),
  ],
};

module.exports = merge(common, dev);
