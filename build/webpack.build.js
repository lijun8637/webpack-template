const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const {merge} = require('webpack-merge');
const commonCofig = require('./webpack.common');

const readEnv = require('./readEnv');
const env = readEnv('../.env.production');

// 测量打包速度
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
// const smp = new SpeedMeasurePlugin();
// module.exports = smp.wrap(prodConfig)
const buildConfig = {
    // 追踪错误和警告
    devtool: 'source-map',
    output: {
        // publicPath: './',
        filename: 'js/[name].[chunkhash].js',
        // chunkFilename: '[name].bundle.js',
    },
    plugins: [
        // 抽离css样式，清除缓存
        new MiniCssExtractPlugin({
            filename: 'css/[name].[chunkhash].css',
            chunkFilename: 'css/[id].css',
        }),
        // 允许创建一个在编译时可以配置的全局常量
        // 对开发模式和发布模式的构建允许不同的行为,可以忘记开发和发布构建的规则
        // "build": "cross-env NODE_ENV=production webpack --config webpack.prod.js"
        // "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': JSON.stringify('production'),
        // }),
        // 定义环境和变量
        new webpack.DefinePlugin({
            'process.env': env,
        }),
    ],
    // 生产环境注入 cdn
    externals: {
        // 'vue': 'Vue',
        // 'vuex': 'Vuex',
        // 'vue-router': 'VueRouter',
        // 'axios': 'axios',
        // 'echarts': 'echarts',
        // 'swiper': 'Swiper'
    },
    // 代码块拆分与模块大小
    optimization: {
        minimize: true,
        // 打包压缩
        minimizer: [
            new CssMinimizerPlugin(),
            // 多进程,默认开启比电脑cup数量少一个（os.cpus().length - 1）的并行多个子任务
            //   new TerserPlugin()
        ],
        splitChunks: {
            // 提取模板:重复数据删除和提取
            chunks: 'all',
            name: 'common',
            minSize: {
                javascript: 30000,
                webassembly: 50000,
            },
            // 防止重复:提取公共模块
            cacheGroups: {
                // 提取重复js代码
                // commons: {
                //     name: "common",
                //     chunks: "initial",
                //     minChunks: 2
                // },
                // 将所有CSS提取到一个styles文件中
                // styles: {
                //     name: 'styles',
                //     test: /\.css$/,
                //     chunks: 'all',
                //     enforce: true
                // }
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.(sc|c|le|sa)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../', // css文件下img路径
                        },
                    },
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

module.exports = merge(commonCofig, buildConfig);
