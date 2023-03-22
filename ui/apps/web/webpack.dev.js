/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const {merge} = require("webpack-merge");
const CopyPlugin = require("copy-webpack-plugin");
const common = require("./webpack.common.js");


// Show warning message when API_DESIGNER_CONFIG env variable is unset.
if (!process.env.API_DESIGNER_CONFIG) {
    console.info("");
    console.info("=======================================================================");
    console.info("Using default 'none' configuration for running on localhost.");
    console.info("You can configure a profile using the API_DESIGNER_CONFIG env var.");
    console.info("Example:  'export API_DESIGNER_CONFIG=staging'");
    console.info("=======================================================================");
    console.info("");
}


const CONFIG = process.env.API_DESIGNER_CONFIG || "none";
console.info("Using API Designer config: ", CONFIG);
const devServerConfigFile = `./configs/${CONFIG}/devServer.json`;
const devServerConfig = require(devServerConfigFile);

let filesToCopy = [
    {from: `./configs/${CONFIG}/config.js`, to: "config.js"}
];

if (devServerConfig.warning) {
    console.info("");
    console.info("====================================================================");
    console.info(devServerConfig.warning);
    console.info("====================================================================");
    console.info("");
}


module.exports = merge(common("development"), {
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
        https: devServerConfig.protocol === "https",
        host: devServerConfig.host,
        port: devServerConfig.port,
        historyApiFallback: true,
        allowedHosts: "all",
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
    plugins: [
        new CopyPlugin({
            patterns: filesToCopy
        })
    ]
});
