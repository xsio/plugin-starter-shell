process.env.NODE_ENV = "development";

module.exports = target => {

const path = require('path');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require(`./webpack.config.entry`)(target);
webpackConfig.resolve.modules = [path.resolve(__dirname, 'node_modules'), 'node_modules'];
webpackConfig.entry[target] = [webpackConfig.entry[target], `webpack-dev-server/client?http://localhost:3003/application/${target}/sockjs-node`];
webpackConfig.plugins.push(new Webpack.HotModuleReplacementPlugin());

const compiler = Webpack(webpackConfig);
const server = new WebpackDevServer(compiler, {
    stats: {
        colors: true
    }
});

server.listen(0, '127.0.0.1', () => {
    const port = server.listeningApp.address().port;
    console.log(`dev server running at http://localhost:${port}`);
});
    
return server;
};
