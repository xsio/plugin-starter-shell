'use strict';

const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const config = require('./webpack.config');
const paths = require('./paths');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';

module.exports = function(target) {
  return {
    disableHostCheck: false,
    compress: true,
    clientLogLevel: 'none',
    contentBase: paths.appPublic,
    watchContentBase: true,
    hot: true,
    hotOnly: true,
    publicPath: config.output.publicPath,
    quiet: true,
    watchOptions: {
      ignored: ignoredFiles(paths.appSrc),
    },
    // Enable HTTPS if the HTTPS environment variable is set to 'true'
    https: protocol === 'https',
    host: host,
    overlay: false,
    historyApiFallback: {
      disableDotRule: true,
    },
    proxy: {
        '**': {
            target: target,
            bypass: function (req, res, next) {
                if (req.headers && req.headers.referer){
                    const refer = target.split("//")[1]
                    req.headers.referer = req.headers.referer.replace('localhost:3003', refer).replace('http','https');
                }
                if (
                    req.url == '/' ||
                    req.url.includes('/tsd/') ||
                    req.url.indexOf('/application') === 0 ||
                    req.url.indexOf('/node_modules') === 0 ||
                    req.url.indexOf('/img') === 0 ||
                    req.url.indexOf('/resources') === 0 ||
                    (
                        req.url.includes('.html') &&
                        req.method === 'GET'
                    ) ||
                    req.url.includes('/css/') ||
                    req.url.includes('/fonts/') ||
                    req.url.includes('/js/') ||
                    req.url.includes('.css') ||
                    req.url.includes('/favicon')||
                    (
                        req.url.includes('.js') &&
                        !req.url.includes('.json')
                    )) {
                    return req.originalUrl;
                }
            },
            onError: function (err, req, res) {
                console.log('error');
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
            },
            onProxyRes: function (proxyRes, req, res) {
                console.log(req.url);
                if (req.url.indexOf('/index') === 0 || req.url.indexOf('index.html') === 0) {
                    let url = req.url.replace('/index','/index.html');
                    proxyRes.headers.location = url[0] === '/' ? url : `/${url}`;
                }
            },
            changeOrigin: true,
            secure: false,
            autoRewrite: true,
            protocolRewrite: 'http',
            xfwd: true
        }
    },
    before(app, devServer) {
      var mount = require('./mount');
      mount(app, devServer, 'convertlab-uilib');
      mount(app, devServer, 'convertlab-scaffold');
      mount(app, devServer, 'convertlab-ui-common');
      mount(app, devServer, 'convertlab-uilib-ana');
      mount.app(app, devServer);
      app.use(errorOverlayMiddleware());
      app.use(noopServiceWorkerMiddleware());
    },
  };
};
