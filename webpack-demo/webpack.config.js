var path = require("'path");

var HtmlwebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    // 多个js入口
    entry: {
        bundle1: './main1.js',
        bundle2: './main2.js',
    },
    output: {
        // 多个输出,且输出到dist文件夹下。
        path: path.join(__dirname, './dist'),
        filename: 'js/[name].[hash].js',
        // 公共路径
        publicPath: "/assets/",
    },
    module: {
        loaders: [
            // babel-loader
            {
                test: /\.js[x]?$/,
                // 当前文件的目录下的src文件夹
                include: path.join(__dirname, 'src'),
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                // 将样式文件单一抽取出来，形成一个link
                loader: ExtractTextPlugin.extract('style', 'css')
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url',
                query: {
                    limit: 10000,
                }
            }
        ]
    },
    babel: {
        presets: ['es2015', 'react'],
    },
    plugins: [
        // js代码压缩
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        // html生成
        new HtmlwebpackPlugin({
            // 生成html文件的标题
            title: "",
            // 生成前指定的模板html
            template: "./src/index.html",
            // 生成后的html文件名
            filename: 'index.html',
            // 注入选项默认是body, 可选head和false(不生成js文件)
            inject: "body",
            favicon: "",
            // chunks 选项的作用主要是针对多入口(entry)文件。默认引用所有，可指定引入js
            chunks: ['index'],
        }),
        new HtmlwebpackPlugin({
            // 生成前指定的模板html
            template: "./src/cart.html",
            // 生成后的html文件名
            filename: 'cart.html',
            chunks: ['cart'],
        }),
        // run的时候自动打开浏览器页面的地址
        new OpenBrowserPlugin({
            url: 'http://localhost:8080'
        }),
        // 热加载
        new webpack.HotModuleReplacementPlugin(),
        // 提取公共模块
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors', // 公共模块的名称
            chunks: chunks,  // chunks是需要提取的模块
            minChunks: chunks.length
        }),
        // 配置提取出的样式文件
        new ExtractTextPlugin('css/[name].css')
    ],
    externals: {
        // 将变量data变为全局都能访问的变量
        'data': 'data'
    }
}
