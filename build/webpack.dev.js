const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {merge} = require('webpack-merge');
const commonCofig = require('./webpack.common');

const readEnv = require('./readEnv');
const env = readEnv('../.env.development');
console.log(env);
const devConfig = {
    // 追踪错误和警告
    devtool: 'inline-source-map',
    output: {
        // publicPath: '/',
        filename: 'js/[name].bundle.js',
    },
    devServer: {
        contentBase: './dist',
        publicPath: '/',
        hot: true,
        open: true,
        port: 8060,
        overlay: true, // 弹出浮层来显示告警
        // proxy: {
        //     [process.env.VUE_APP_BASE_API]: {
        //         target: '127.0.0.1',
        //         changeOrigin: true,
        //         pathRewrite: {
        //             ['^' + process.env.VUE_APP_BASE_API]: '',
        //         },
        //     },
        // },
    },
    plugins: [
        // 抽离css样式，清除缓存
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css',
        }),
        // 定义环境和变量
        // new webpack.DefinePlugin({
        //     'process.env': env,
        // }),
    ],
    module: {
        rules: [
            {
                test: /\.(sc|c|le|sa)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    // 这个就是添加兼容的插件  依赖于 postcss.config.js 还有 .browserslistrc
                    'postcss-loader',
                    // { loader: 'postcss-loader', options: { sourceMap: devMode ? 'inline' : false } },
                    'sass-loader',
                    // 'less-loader',
                ],
            },
        ],
    },
};

module.exports = merge(commonCofig, devConfig);
