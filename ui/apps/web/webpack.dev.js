/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const {merge} = require("webpack-merge");
const CopyPlugin = require("copy-webpack-plugin");
const common = require("./webpack.common.js");
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || "9000";
const PROTOCOL = process.env.PROTOCOL || "http";

module.exports = merge(common("development"), {
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
        https: PROTOCOL === "https",
        host: HOST,
        port: PORT,
        historyApiFallback: true,
        open: true,
        hot: true,
        client: {
            overlay: true,
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
        },
    },
    // plugins: [
    //     new CopyPlugin({
    //         patterns: [
    //             {from: "./src/keycloak.dev.json", to: "keycloak.json"}
    //         ]
    //     })
    // ]
});
