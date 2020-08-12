var httpProxy = require('http-proxy');
var bodyParser = require('body-parser').json({ strict: false });
var path2regexp = require('path-to-regexp');
var compileMap = require('./compileMap');
function mount(app, devServer, name) {
    var proxy = httpProxy.createProxyServer();
    var server;
    app.use((req, res, next) => {
        if (!server) {
            server = req.socket.server;
            server.on('upgrade', function (req, socket) {
                var m = req.url.match(path2regexp(`/${name}/(*)`, []));
                if (m) {
                    var [, rest] = m;
                    req.url = `/${rest}`;
                    proxy.ws(req, socket, { target: `ws://localhost:${port}` }, console.log);
                }
            });
        }
        next();
    });
    var port;
    app.put(`/__dev/${name}`, bodyParser, (req, res) => {
        port = req.body;
        res.status(201);
        res.end();
        devServer.sockWrite(devServer.sockets, 'content-changed');
    });
    app.delete(`/__dev/${name}`, (req, res) => {
        port = undefined;
        res.status(204);
        res.end();
        devServer.sockWrite(devServer.sockets, 'content-changed');
    });
    app.use(`/${name}`, (req, res, next) => {
        proxy.web(req, res, { target: `http://localhost:${port}` }, function (e) {
            res.status(500);
            res.send(e);
        });
    });
    app.get(`/node_modules/${name}/lib/index.js`, (req, res, next) => {
        if (port) {
            req.url = "/index.js";
            proxy.web(req, res, { target: `http://localhost:${port}` }, function (e) {
                res.status(500);
                res.send(e);
            });
        } else
            next();
    });
}
module.exports = mount;
mount.app = mountApp;

function mountApp(app, devServer) {
    var proxy = httpProxy.createProxyServer();
    var application = {};
    var entry = {};
    app.use("/application", (req, res, next) => {
        var name = matchApp(req);
        if (name)
            proxy.web(req, res, { target: `http://localhost:${application[name]}` }, function (e) {
                res.status(500);
                res.send(e);
            });
        else if (name = matchEntry(req)) {
            if (req.url.startsWith(`/${name}/sockjs-node`))
                req.url = req.url.substr(`/${name}`.length);
            if (entry[name])
                proxy.web(req, res, { target: `http://localhost:${entry[name]}` }, function (e) {
                    res.status(500);
                    res.send(e);
                });
            else {
                console.log(`\x1b[36mcompiling ${name}..\x1b[0m`);
                var devServer = require("./start.entry.js")(name);
                devServer.listeningApp.on("listening", () => {
                    entry[name] = devServer.listeningApp.address().port;
                    proxy.web(req, res, { target: `http://localhost:${entry[name]}` }, function (e) {
                        res.status(500);
                        res.send(e);
                    });
                });
            }
        }
        else
            next();
    });
    var server;
    app.use((req, res, next) => {
        if (!server) {
            server = req.socket.server;
            server.on('upgrade', function (req, socket) {
                if (req.url.startsWith("/application"))
                    req.url = req.url.substr("/application".length);
                else
                    return;
                var name = matchApp(req);
                if (name)
                    proxy.ws(req, socket, { target: `ws://localhost:${application[name]}` }, console.log);
                else if (name = matchEntry(req)) {
                    if (req.url.startsWith(`/${name}/sockjs-node`))
                        req.url = req.url.substr(`/${name}`.length);
                    proxy.ws(req, socket, { target: `ws://localhost:${entry[name]}` }, console.log);
                }
            });
        }
        next();
    });
    function matchApp(req) {
        for (var name in application)
            if (req.url.startsWith(`/${name}`)) {
                req.url = req.url.substr(`/${name}`.length);
                return name;
            }
    }
    function matchEntry(req) {
        for (var name in compileMap)
            if (req.url.startsWith(`/${name}`))
                return name;
    }
    app.put("/__dev/application/:name(*)", bodyParser, (req, res) => {
        application[req.params.name] = req.body;
        res.status(201);
        res.end();
        console.log(`mounted app ${req.params.name}.`);
    });
    app.delete("/__dev/application/:name(*)", (req, res) => {
        delete application[req.params.name];
        res.status(204);
        res.end();
        console.log(`unmounted app ${req.params.name}.`);
    });
}
