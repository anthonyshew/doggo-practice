const webpack = require("webpack");
require("dotenv").config({
  path: "../../.env",
});

const withTM = require("next-transpile-modules")(["ui"]);

module.exports = withTM({
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(process.env));
    return config;
  },
  reactStrictMode: true,
});
