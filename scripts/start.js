'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const paths = require('../config/paths');
const config = require('../config/webpack.config');
var heat = require('./heat.js');
heat(config);
for (var entry in config.entry)
  if (entry != 'login' && entry != 'web-report' && entry != 'static' && entry != 'dependencies')
    delete config.entry[entry];
const HtmlWebpackPlugin = require('html-webpack-plugin');
config.plugins = config.plugins.filter(plugin =>
  !(plugin instanceof HtmlWebpackPlugin)
  ||
  plugin.options.filename == 'login.html'
);
const createDevServerConfig = require('../config/webpackDevServer.config');

const targets = {
    test: 'https://app.dmhub.cn',
    validation: 'https://app.convertwork.cn',
    prod: 'https://app.convertlab.com',
    appz: 'https://appaz.convertlab.com',
    foton: 'https://app-dmhub.foton.com.cn',
    v1:'https://appv1.convertwork.cn',
};

const target = process.argv[2] || 'test';
console.log(target);


const DEFAULT_PORT = 3003;
const HOST = "0.0.0.0";

choosePort(HOST, DEFAULT_PORT)
  .then(port => {
    if (port == null) {
      return;
    }
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const appName = require(paths.appPackageJson).name;
    const urls = prepareUrls(protocol, HOST, port);

    // Create a webpack compiler that is configured with custom messages.
    const compiler = createCompiler(webpack, config, appName, urls, false);

    // Serve webpack assets generated by the compiler over a web sever.
    const serverConfig = createDevServerConfig(targets[target]);
    const devServer = new WebpackDevServer(compiler, serverConfig);
    // Launch WebpackDevServer.
    devServer.listen(port, HOST, err => {
      if (err) {
        return console.log(err);
      }
      console.log('Starting the development server...\n');
      console.log(`backend server url ${targets[target]}`);
      openBrowser(urls.localUrlForBrowser);
    });

    ['SIGINT', 'SIGTERM'].forEach(function(sig) {
      process.on(sig, function() {
        devServer.close();
        process.exit();
      });
    });
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
