const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: './src/index.tsx',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', 
    clean: true,
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/',
      watch: true
    },
    port: 3000,
    host: 'localhost',
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  plugins: [new ReactRefreshWebpackPlugin()],
});
