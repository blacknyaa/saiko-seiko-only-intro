import { resolve } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";

const SVGIdPlugin = require("./webpack/svg-id-plugin.js");

export default () => {
  const isDevelopment = process.env.NODE_ENV === "development";

  return {
    mode: process.env.NODE_ENV || "development",
    devtool: isDevelopment ? "eval-source-map" : "source-map",
    cache: isDevelopment
      ? {
          type: "filesystem",
          buildDependencies: {
            config: [__filename],
          },
        }
      : false,
    devServer: {
      host: "0.0.0.0",
      hot: true,
      static: {
        directory: resolve("public"),
      },
      historyApiFallback: true,
    },
    entry: "./src/index.js",
    output: {
      filename: isDevelopment ? "bundle.js" : "bundle.[contenthash].js",
      path: resolve("public"),
      clean: true,
      publicPath: "/",
    },
    stats: "errors-only",
    plugins: [
      new MiniCssExtractPlugin({
        filename: isDevelopment ? "styles.css" : "styles.[contenthash].css",
      }),
      new HtmlWebpackPlugin({ template: "./src/index.html" }),
      new SVGIdPlugin({
        files: ["src/animation/scene.svg"],
        cleanName: "framemask_1_",
        runOnce: isDevelopment,
      }),
      ...(isDevelopment
        ? []
        : [new FaviconsWebpackPlugin("./src/images/logo.png")]),
    ],
    optimization: {
      minimize: !isDevelopment,
      splitChunks: isDevelopment
        ? false
        : {
            chunks: "all",
            cacheGroups: {
              scenes: {
                test: (module) => module.identifier().includes("scene.svg"),
                name(module) {
                  const moduleFolder = module
                    .identifier()
                    .split("/")
                    .slice(1, -1)
                    .pop();

                  return `${moduleFolder}`;
                },
                filename: "[name].js",
                enforce: true,
                chunks: "initial",
              },
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true,
              },
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendors",
                priority: -10,
                chunks: "all",
              },
            },
          },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: ["babel-loader"],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            { loader: "css-loader", options: { importLoaders: 1 } },
            "postcss-loader",
          ],
        },
        {
          test: /\.html$/,
          use: ["html-loader"],
        },
        {
          test: /\.(gif|png|jpe?g)$/i,
          type: "asset/resource",
          generator: {
            filename: "images/[name][ext]",
          },
          use: [
            {
              loader: "image-webpack-loader",
              options: {
                disable: process.env.NODE_ENV === "development",
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          issuer: /\.[jt]sx?$/,
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                memo: true,
                exportType: "default",
                svgo: !isDevelopment,
                svgoConfig: {
                  plugins: [
                    {
                      name: "preset-default",
                      params: {
                        overrides: {
                          removeViewBox: false,
                          cleanupIds: false,
                          removeUselessDefs: false,
                          removeUnknownsAndDefaults: false,
                          removeUselessStrokeAndFill: false,
                          convertShapeToPath: false,
                          mergePaths: false,
                          convertPathData: false,
                          removeHiddenElems: false,
                          removeEmptyContainers: false,
                          removeEmptyText: false,
                          removeUnusedNS: false,
                          convertColors: false,
                          convertTransform: false,
                          removeNonInheritableGroupAttrs: false,
                        },
                      },
                    },
                    { name: "removeDimensions", active: false },
                    { name: "removeStyleElement", active: false },
                    { name: "removeScriptElement", active: false },
                  ],
                },
              },
            },
          ],
        },
      ],
    },
  };
};
