const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const ASSETS_DIR = path.resolve(__dirname, 'assets');
const BUILD_DIR = path.resolve(__dirname, 'build');
const SRC_DIR = path.resolve(__dirname, 'src');

module.exports = (env, argv) => {
    return {
        entry: {
            'index': [path.resolve(SRC_DIR, 'index.tsx')]
        },
        output: {
            path: BUILD_DIR,
            filename: '[name].bundle.js'
        },
        devtool: argv.mode === 'development' ? 'inline-source-map' : false,
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
            plugins: [new TsconfigPathsPlugin()]
        },
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: [
                        /node_modules/
                    ],
                    use: {
                        loader: 'babel-loader?name=js/[hash].[ext]',
                        options: {
                            presets: ['es2017'],
                        }
                    }
                },
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader"
                },
                {
                    test: /\.html$/,
                    loader: 'html-loader'
                },
                {
                    test: /\.css$/,
                    loader: 'css-loader'
                }, 
                {
                    test: /\.(png|jpg|jpeg|gif|ico)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: './img/[name].[hash].[ext]'
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({
                inject: true,
                template: path.resolve(ASSETS_DIR, 'index.html'),
                filename: 'index.html'
            }),
            // new CopyWebpackPlugin(
            //     [
            //         // {
            //         //     from: path.resolve(ASSETS_DIR, 'img'), to: 'img'
            //         // },
            //         // {
            //         //     from: path.resolve(ASSETS_DIR, 'error'), to: 'error'
            //         // },
            //         // {
            //         //     from: path.resolve(ASSETS_DIR, 'icons'), to: 'icons'
            //         // }
            //     ],
            //     { 
            //         copyUnmodified: false
            //     }
            // )
        ]
    }
}