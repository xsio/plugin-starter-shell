const webpack = require('webpack');
module.exports = heat;
function heat(config) {
    delete config.output.path;
    delete config.entry['static'];
    var babelLoader = config.module.rules.find(rule => rule.loader == 'babel-loader');
    if (babelLoader.options.plugins === undefined)
        babelLoader.options.plugins = [];
    babelLoader.options.plugins.push('react-hot-loader/babel');
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    for (var name in config.entry)
        if (name != 'static' && name != 'dependencies' && name != 'web-report')
            config.entry[name] = [
                require.resolve('react-dev-utils/webpackHotDevClient'),
                config.entry[name]
            ];
}
