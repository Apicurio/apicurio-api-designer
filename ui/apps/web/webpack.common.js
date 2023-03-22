/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = (env, argv) => {
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
                    test: /\.(jpe?g|svg|png|gif|ico|eot|ttf|woff2?)(\?v=\d+\.\d+\.\d+)?$/i,
                    type: 'asset/resource',
                },
            ],
        },
        output: {
            filename: "[name].bundle.js",
            path: path.resolve(__dirname, "dist"),
            publicPath: "auto",
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, "src/public", "index.html")
            }),
            new Dotenv({
                systemvars: true,
                silent: true,
            }),
            new CopyPlugin({
                patterns: [
                    {from: "./src/public/favicon.ico", to: "images"},
                    {from: "./src/public/logo.png", to: "images"}
                ]
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
