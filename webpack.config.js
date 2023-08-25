const path = require('path');
const slsw = require('serverless-webpack');
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const chalk = require('chalk')
const CopyPlugin = require("copy-webpack-plugin");
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
    context: __dirname,
    mode: 'none',
    entry: slsw.lib.entries,
    devtool: slsw.lib.webpack.isLocal ? false : 'source-map',
    resolve: {
        extensions: ['.mjs', '.json', '.ts', '.js', '.jsx', '.ts', '.tsx'],
        alias: {
            '@core': path.resolve(__dirname, './src/core'),
            '@db': path.resolve(__dirname, './src/dynamodb'),
            '@const': path.resolve(__dirname, './src/constants'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@shared': path.resolve(__dirname, './src/shared'),
            '@logger': path.resolve(__dirname, './src/logger'),
            '@app': path.resolve(__dirname, './src/app'),
            '@resources': path.resolve(__dirname, './src/resources')
        }
    },
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js',
        chunkFilename: "[name].js"
    },
    target: 'node',
    externals: [nodeExternals()],
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.(tsx?)$/,
                loader: 'ts-loader',
                exclude: [
                    [
                        path.resolve(__dirname, 'node_modules'),
                        path.resolve(__dirname, '.serverless'),
                        path.resolve(__dirname, '.webpack'),
                        path.resolve(__dirname, 'e2e-tests'),
                    ],
                ],
                options: {
                    transpileOnly: true,
                    experimentalWatchApi: true,
                },
            },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.WatchIgnorePlugin({ paths: ['src/'] }),
        new ProgressBarPlugin({
            format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',

            complete: '▰',
            incomplete: '▱',
            clear: false
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            analyzerHost: '127.0.0.1',
            analyzerPort: '8888',
            reportFilename: process.env.NODE_ENV === 'development' && 'report.html',
            openAnalyzer: false,
            generateStatsFile: false,
            statsFilename: 'stats.json'
        }),
        new LodashModuleReplacementPlugin({
            collections: true,
            paths: true,
            flattening: true
        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, './src/resources/**/*.json'), to: path.join(__dirname, '.webpack') },
                { from: "views", to: path.join(__dirname, '.webpack', 'service', 'src', 'views') },
            ],
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            (compiler) => {
                const TerserPlugin = require('terser-webpack-plugin');
                new TerserPlugin({
                    terserOptions: {
                        compress: true,
                        ecma: true,
                        sourceMap: true,
                        mangle: true,
                        output: {
                            beautify: false,
                            comments: false
                        }
                    },
                    extractComments: false
                }).apply(compiler);
            },
        ],
        // usedExports: true,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/, ///< put all used node_modules modules in this chunk
                    name: "vendor", ///< name of bundle
                    chunks: "all" ///< type of code to put in this bundle
                }
            }
        }
    },
};