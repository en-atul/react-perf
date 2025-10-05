const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  plugins: [new ReactRefreshWebpackPlugin()],
});
