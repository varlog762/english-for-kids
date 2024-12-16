const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const CopyWebpackPlugin = require("copy-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const TerserWebpackPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      inject: "body",
      template: "./index.html",
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: "assets/icons/*.ico",
          to: "assets/icons/[name][ext]",
        },
        {
          from: "assets/audio/*.mp3",
          to: "assets/audio/[name][ext]",
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "assets/css/styles.css",
    }),
  ];

  if (isProd) {
    base.push(new BundleAnalyzerPlugin());
  }

  return base;
};

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    },
  };

  if (isProd) {
    config.minimizer = [new TerserWebpackPlugin(), new CssMinimizerPlugin()];
  }

  return config;
};

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: "./assets/js/script.js",

  output: {
    filename: filename("js"),
    path: path.resolve(__dirname, "dist"),
  },
  optimization: optimization(),

  devServer: {
    port: 8080,
    hot: isDev,
  },
  devtool: isDev ? "source-map" : false,
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.png$/,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name][ext]",
        },
      },
    ],
  },
};
