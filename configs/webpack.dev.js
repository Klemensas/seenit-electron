const CopyPlugin = require('copy-webpack-plugin');
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

export default merge(common, {
  entry: [
    'react-hot-loader/patch'
  ]
  mode: "development",
  devtool: "inline-source-map",
  plugins: [
    new CopyPlugin([
      { from: 'public/', to: '../' },
      { from: 'dev/icon.png', to: '../icon16.png', force: true },
      { from: 'dev/icon.png', to: '../icon48.png', force: true },
      { from: 'dev/icon.png', to: '../icon128.png', force: true },
    ]),
  ],
});
