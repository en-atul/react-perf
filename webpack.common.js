const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const mode = process.env.NODE_ENV || "development";
const styleLoader =
  mode === "production" ? MiniCssExtractPlugin.loader : "style-loader";

module.exports = {
  entry: "./src/index.tsx",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', 
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.module\.scss$/,
        use: [
          styleLoader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName:
                  mode === "production"
                    ? "[hash:base64:5]"
                    : "[local]__[hash:base64:5]",
              },
              importLoaders: 1,
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /\.module\.(scss|sass)$/,
        use: [
          styleLoader,
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.css$/,
        use: [
          styleLoader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
        ],
      },

      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: "asset",
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new Dotenv(),
  ],
};
