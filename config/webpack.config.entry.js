'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const path = require('path');
const child_process = require('child_process');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const paths = require('./paths');
const compileMap = require('./compileMap');

module.exports = entry => {

var imageLoader, babelLoader, cssLoader;
const webpackConfig = {
    entry: {},
    output: undefined,
    resolve: {},
    module: {
        rules: [
            imageLoader = {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                include: paths.appSrc,
                loader: require.resolve('url-loader'),
                options: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },
            babelLoader = {
                test: /\.js$/,
                include: paths.appSrc,
                loader: 'babel-loader'
            },
            cssLoader = {
                test: /\.(css|less)$/,
                include: paths.appSrc,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
        ],
    },
    plugins: [
    ],
};

const addLoaders = (loader, nodeModule) => {
    if (!(loader.include instanceof Array))
        loader.include = [loader.include];

    loader.include.push(path.resolve(__dirname, `../node_modules/${nodeModule}`));
};

['convertlab-ui-common', 'convertlab-uilib-ana'].map(nodeModule => {
    addLoaders(cssLoader, nodeModule);
});

addLoaders(cssLoader, 'jquery-ui');

webpackConfig.plugins.push(
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) })
);

if (process.env.NODE_ENV == 'development') {
    webpackConfig.devtool = 'cheap-module-eval-source-map';
    webpackConfig.output = {
        pathinfo: true,
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        devtoolModuleFilenameTemplate: info =>
            path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    };
    babelLoader.options = {
        cacheDirectory: true,
    };
    webpackConfig.resolve.plugins = [
        new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ];
    webpackConfig.plugins.push(
        new webpack.NamedModulesPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    );
    webpackConfig.performance = {
        hints: false,
    };
}

if (process.env.NODE_ENV == 'production') {
    webpackConfig.plugins.push(new UglifyJsPlugin({
        parallel: true
    }));
    webpackConfig.devtool = false;
    webpackConfig.output = {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name]-[hash:8].js',
        chunkFilename: '[name]-[hash:8].js'
    };
}

webpackConfig.externals = {
    react: 'React',
    'react-dom': 'ReactDOM',
    jquery: '$',
    'convertlab-uilib': 'CL_uilib',
    'convertlab-scaffold': 'CL_scaffold',
    'convertlab-ui-common': 'CL_uicommon',
    'convertlab-uilib-ana': 'CL_uilib_ana',
    echarts: 'echarts',
    antd: 'antd',
    moment: 'moment',
    lodash: '_'
};

webpackConfig.entry[entry] = path.join(paths.appSrc, `${entry}.js`);
const html = compileMap[entry];
if (!html) {
    console.log('can not find ' + entry + '.js');
    return;
}

webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
        title: html.title,
        inject: true,
        template: entry === 'login' ? paths.loginHtml : paths.template,
        filename: `${entry}.html`,
        plugin: [...html.plugin, ...html.customPlugin].map(plugin => {
            var match = plugin.match(/node_modules\/(convertlab-[^\/]*)/);
            if (match) {
                var module = match[1];
                var version = require(`../node_modules/${module}/package.json`).version;
                plugin += `?${version}`;
            }
            return plugin;
        }),
        css: html.css,
        env: process.env.NODE_ENV,
        uilibVersion: require('../node_modules/convertlab-uilib/package.json').version,
        uiCommonVersion: require('../node_modules/convertlab-ui-common/package.json').version,
        uilibAnaVersion: require('../node_modules/convertlab-uilib-ana/package.json').version,
        gitHash: child_process.execSync("git rev-parse --short HEAD").toString().trimRight()
    })
);

return webpackConfig;
};
