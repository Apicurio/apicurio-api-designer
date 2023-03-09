/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");
const ASSET_PATH = process.env.ASSET_PATH || "/";

const isPatternflyStyles = (stylesheet) => stylesheet.includes("patternfly");

module.exports = (env, argv) => {
    const isProduction = argv && argv.mode === "production";
    return {
        module: {
            rules: [
                {
                    test: /\.(tsx|ts|jsx)?$/,
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                transpileOnly: true,
                                experimentalWatchApi: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader"],
                    sideEffects: true
                },
                {
                    test: /\.(ttf|eot|woff|woff2)$/,
                    use: {
                        loader: "file-loader",
                        options: {
                            limit: 5000,
                            name: "[contenthash:8].[ext]",
                        }
                    }
                },
                {
                    test: /\.(svg|jpg|jpeg|png|gif)$/i,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 5000,
                                name: isProduction ? "[contenthash:8].[ext]" : "[name].[ext]",
                            }
                        }
                    ]
                },
            ],
        },
        output: {
            filename: "[name].bundle.js",
            path: path.resolve(__dirname, "dist"),
            publicPath: ASSET_PATH,
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, "src", "index.html"),
            }),
            new Dotenv({
                systemvars: true,
                silent: true,
            }),
            new CopyPlugin({
                patterns: [{from: "./src/favicon.png", to: "images"}],
            }),
            new MiniCssExtractPlugin({
                filename: "[name].[contenthash:8].css",
                chunkFilename: "[contenthash:8].css",
                ignoreOrder: true,
                insert: (linkTag) => {
                    const preloadLinkTag = document.createElement("link")
                    preloadLinkTag.rel = "preload"
                    preloadLinkTag.as = "style"
                    preloadLinkTag.href = linkTag.href
                    document.head.appendChild(preloadLinkTag)
                    document.head.appendChild(linkTag)
                }
            }),
        ],
        resolve: {
            extensions: [".js", ".ts", ".tsx", ".jsx"],
            plugins: [
                new TsconfigPathsPlugin({
                    configFile: path.resolve(__dirname, "./tsconfig.json"),
                }),
            ],
            symlinks: false,
            cacheWithContext: false,
        },
    };
};
