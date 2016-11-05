var path = require('path'),
ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    context: path.resolve(__dirname, 'assets'),
    entry: {
        app: "./index.js"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("[name].css")
    ]
};