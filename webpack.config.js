var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: ["./src/index.js"],
    node: {
        __dirname: true
    },
    output: {
        path: __dirname + "/dist",
        filename: "index.js",
        publicPath: "/"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /node_modules[\\\/]admin-config[\\\/].*\.jsx?$/, loader: 'babel' },
            { test: /\.html$/, loader: 'html' },
            { test: /\.css$/, loader: ExtractTextPlugin.extract('css') },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') },
	    { test: /\.json$/, loader: 'json' },
            { test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/, loader: "file" }
        ]
    },
    devServer: {
       contentBase: "./dist/front",
       hot: true
    },
    plugins: [
        new ExtractTextPlugin('[name].css', {
            allChunks: true
        }),
        /* copy static front-end resources */
        new CopyWebpackPlugin([
            { from: 'src/front', to: 'front' }
        ]),
/*      uncomment for minifying
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        })
*/
    ],
    target: 'node'
};
