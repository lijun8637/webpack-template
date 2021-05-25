// webpack 5 运行于 Node.js v10.13.0+ 的版本。
const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const readEnv = require('./readEnv');
const development = readEnv('../.env.development');
const production = readEnv('../.env.production');

console.log(development, production, process.env.ASSECT_PATH);

/**
 * @param {string} url 路径名称.
 * @returns {string} 绝对路径
*/
function resolve (url) {
    return path.resolve(__dirname, url);
}
// console.log(process.env.NODE_ENV, process.env.ASSECT_PATH);
const devMode = process.env.NODE_ENV === 'development';

const assectPath = process.env.ASSECT_PATH || './';
// bundle 分析
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 测量打包速度
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
// const smp = new SpeedMeasurePlugin();
// module.exports = smp.wrap(prodConfig)

module.exports = {
    // target:"browserslist", //默认"browserslist"，[web "es2020"] / node10.13

    // 持久缓存
    // cache: {
    //     // 1. 将缓存类型设置为文件系统
    //     type: 'filesystem',

    //     buildDependencies: {
    //       // 2. 将你的 config 添加为 buildDependency，以便在改变 config 时获得缓存无效
    //       config: [__filename],

    //       // 3. 如果你有其他的东西被构建依赖，你可以在这里添加它们
    //       // 注意，webpack、加载器和所有从你的配置中引用的模块都会被自动添加
    //     },
    // },
    entry: {
        // app: ['babel-polyfill', './src/index.js'],
        app: './src/index.js',
    },
    output: {
        publicPath: assectPath,
        path: resolve('../dist'),

        /**
         * With zero configuration,
         *   clean-webpack-plugin will remove files inside the directory below
         */
        // path: path.resolve(process.cwd(), 'dist'),
        // filename: 'js/[name].bundle.js',
    },
    devServer: {
        contentBase: './dist',
        publicPath: '/',
        hot: true,
        open: true,
        port: 8060,
        overlay: true, // 弹出浮层来显示告警
        proxy: {
            [process.env.VUE_APP_BASE_API]: {
                target: '127.0.0.1',
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: '',
                },
            },
        },
    },
    resolve: {
        // 引入时不带扩展名
        extensions: ['.js', '.vue', '.css', '.json', '.scss', '.sass', '.less'],
        alias: {
            '@': resolve('../src'),
        },
    },
    // 追踪错误和警告
    devtool: devMode ? 'inline-source-map' : 'source-map',
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
    plugins: [
        new CleanWebpackPlugin(),

        new HTMLWebpackPlugin({
            template: resolve('../src/index.html'),
            filename: 'index.html',
            chunks: ['app'],
            hash: true,
            // favicon:'favicon.ico',
        }),
        // HMR
        // new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProgressPlugin(),

        // 抽离css样式，清除缓存
        new MiniCssExtractPlugin({
            filename: devMode ? 'css/[name].css' : 'css/[name].[chunkhash].css',
            chunkFilename: 'css/[id].css',
        }),
        // new BundleAnalyzerPlugin(),
        new webpack.ProvidePlugin({
            _: 'lodash',
            _join: ['lodash', 'join'],
        }),
        // new webpack.DefinePlugin({
        //     'process.env.ASSECT_PATH': JSON.stringify(assectPath),
        //     'process.env.NODE_ENV': JSON.stringify('production'),
        // }),
        new webpack.DefinePlugin({
            'process.env': production,
        }),
        // 模块标识符：修复 vendor bundle 会随着自身的 module.id 的修改，而发生变化
        // new webpack.HashedModuleIdsPlugin(),

        // 提供服务器服务
        // new WorkboxPlugin.GenerateSW({
        //     // 这些选项帮助 ServiceWorkers 快速启用
        //     // 不允许遗留任何“旧的” ServiceWorkers
        //     clientsClaim: true,
        //     skipWaiting: true
        // })
    ],

    module: {
        rules: [
            // 解析 .eslint.js 文件
            // {
            //     test: /\.(vue|js|jsx)$/,
            //     loader: 'eslint-loader',
            //     exclude: /node_modules/,
            //     enforce: 'pre',
            //     options: {
            //     　　fix: true,
            //     }
            // },
            {
                test: /\.(js|jsx)$/,
                // cache-loader 将结果缓存到磁盘里
                // 持久化缓存 'cache-loader','thread-loader',          //多线程构建           // 缓存与增量构建
                use: ['babel-loader?cacheDirectory'],
                // include: path.join(__dirname, 'src'),
                include: resolve('src'),
                exclude: /node_modules/,
                enforce: 'pre',
                // options: {} 多个loader,不能使用options
            },

            {
                test: /\.(sc|c|le|sa)ss$/,
                use: [
                    devMode
                        ? 'style-loader'
                        : {
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
            {
                test: /\.(jpg|png|svg|gif)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: 'static/imgs/[name].[hash:7].[ext]',
                        },
                    },
                ],
            },
            // 把html的资源(img)打包到运行环境 (负责引入img，从而能被url-loader进行处理)
            {
                test: /.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        esModule: false,
                    },
                },
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'static/media/[name].[hash:7].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 10000,
                            name: 'static/fonts/[name].[hash:7].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    {
                        loader: 'csv-loader',
                        options: {
                            limit: 10000,
                            name: 'static/data/[name].[hash:7].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.xml$/,
                use: [
                    {
                        loader: 'xml-loader',
                        options: {
                            limit: 10000,
                            name: 'static/xml/[name].[hash:7].[ext]',
                        },
                    },
                ],
            },
        ],
    },
};
