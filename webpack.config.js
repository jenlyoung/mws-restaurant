const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: {
        index: './src/index.js',
        restaurant: './src/restaurant_info.js'
    },
    mode: 'production',
    devtool: 'source-map',
    devServer: {
        contentBase: './dist'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }, {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'restaurant.html',
            template: 'src/restaurant.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new CleanWebpackPlugin(['dist']),
        new CopyWebpackPlugin([{from: 'src/images', to: 'images'}]),
        new WorkboxPlugin.GenerateSW({
            // these options encourage the ServiceWorkers to get in there fast
            // and not allow any straggling "old" SWs to hang around
            clientsClaim: true,
            skipWaiting: true,
            exclude: [/\.(?:png|jpg|jpeg|svg)$/],
            runtimeCaching: [{
                urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
                handler: 'cacheFirst',
                options: {
                    cacheName: 'images',
                    expiration: {
                        maxEntries: 10
                    }
                }
            }]
        }),
        new CompressionPlugin({
            test: /\.js/
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    output: {
                        comments: false,
                        beautify: false,
                    },
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: undefined,
                    keep_fnames: false,
                    safari10: false
                }
            })
        ]
    }
};