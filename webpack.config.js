const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        index: './src/index.js',
        restaurant: './src/restaurant_info.js'
    },
    devtool: 'inline-source-map',
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
        new HtmlWebpackPlugin({filename: 'index.html', template: 'src/index.html'}),
        new HtmlWebpackPlugin({filename: 'restaurant.html', template: 'src/restaurant.html'}),
        // new CleanWebpackPlugin(['dist'], {exclude: ['index.html', 'restaurants.json', 'restaurant.html']}),
        new CopyWebpackPlugin([{from: 'src/images', to: 'images'}]),
        new WorkboxPlugin.GenerateSW({
            // these options encourage the ServiceWorkers to get in there fast
            // and not allow any straggling "old" SWs to hang around
            clientsClaim: true,
            skipWaiting: true
        })
    ],
};