const path = require('path');
const fs = require('fs');
module.exports = mount;
function mount(config, name, dir) {
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias[name] = path.resolve(__dirname, dir);
    const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
    config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));
    for (var rule of config.module.rules) {
        if (rule.include === undefined)
            continue;
        if (!(rule.include instanceof Array))
            rule.include = [rule.include];
        for (var i in rule.include)
            if (rule.include[i] == path.resolve(__dirname, `../node_modules/${name}`))
                rule.include[i] = path.resolve(__dirname, dir);
    }
    var babelLoader = config.module.rules.find(rule => rule.loader == 'babel-loader')
    if (babelLoader.options.plugins)
        babelLoader.options.plugins = babelLoader.options.plugins
            .map(require.resolve);
    babelLoader.options.presets = JSON.parse(fs.readFileSync(path.join(__dirname, '../.babelrc'))).presets;
    babelLoader.options.presets = babelLoader.options.presets
        .map(name => `babel-preset-${name}`)
        .map(require.resolve);
    config.resolve.alias['react-hot-loader'] = require.resolve('react-hot-loader');
}
