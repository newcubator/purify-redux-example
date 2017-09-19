var path = require("path");
var webpack = require("webpack");
var NotifierPlugin = require("webpack-notifier");
var CleanWebpackPlugin = require("clean-webpack-plugin");
var srcDir = path.resolve(__dirname, "src");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var environment = process.env.NODE_ENV || "development";

module.exports = {
	context: path.join(__dirname, "src"),
	entry: {
		index: ["./index.ts"]
	},
	output: {
		path: path.join(__dirname, "build"),
		filename: "[name].js"
	},
	resolve: {
		// resolve absolute module names relative to node_modules folder
		root: [path.join(__dirname, "node_modules")],
		// file extensions to resolve
		extensions: ["", ".ts", ".tsx", ".js", ".json"]
	},
	module: {
        preLoaders: [{
            test: /\.ts$/,
            include: [srcDir],
            loader: "tslint-loader"
        }],
		loaders: [{
			// transpile with typescript
			test: /\.ts$/,
			include: [srcDir],
            loader: "ts-loader"
		}, {
			// copy resources as separate files
			test: /\.png|\.jpg|\.gif|\.ttf|\.svg|\.ico/,
			loader: "file?name=[path][name].[ext]"
		}]
	},
	plugins: [
		// clean build folder before build
		new CleanWebpackPlugin(["build"],{
			root: __dirname
		}),
		// show desktop notification
		new NotifierPlugin({
			contentImage: path.join(__dirname, "logo.png"),
			alwaysNotify: true
		}),
		new HtmlWebpackPlugin({
			template: "index.html",
			favicon: "../logo.png",
			chunks: ["index"]
		})
	],
	// optimize flag
	debug: environment === "development",
	// source maps flag
	devtool: environment === "development" ? "sourcemap" : undefined
};
