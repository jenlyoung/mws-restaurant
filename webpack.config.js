const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
//used to take images from src to dist
const CopyWebpackPlugin = require('copy-webpack-plugin');
//plugin for the service worker
const WorkboxPlugin = require('workbox-webpack-plugin');
//plugin for putting html in dist
const HtmlWebpackPlugin = require('html-webpack-plugin');
//plugin for compressing js into gz
const CompressionPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

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
            //code below limits the caching of the images for faster runtime
            exclude: [/\.(?:png|jpg|jpeg|svg)$/],
            runtimeCaching: [{
                urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
                handler: 'cacheFirst',
                options: {
                    cacheName: 'images',
                    expiration: {
                        maxEntries: 20
                    }
                }
            }]
        }),
        new CompressionPlugin({
            test: /\.js/
        }),
        new WebpackPwaManifest({
            name: 'Restaurant Reviews',
            short_name: 'MWS',
            description: 'My awesome Progressive Web App!',
            background_color: '#444444',
            theme_color: '#444444',
            crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
            icons: [
                {
                    src: path.resolve('src/images/map_marker.png'),
                    sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
                }
            ]
        })
    ],
    // split code into various smaller bundles
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        //uglifier removes comments and does not beautify
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