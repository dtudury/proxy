var http = require('http');

var routes = require('./routes.json');

module.exports = function(port, hostname) {
    http.createServer(function (req, res) {
        console.log(req.method + ': ' + req.headers.host + req.url);
        var route;
        if (route = routes[req.headers.host]) {
            var options = {port: route.port, path: req.url, method: req.method};
            var connector = http.request(options, function (response) {
                res.writeHeader(response.statusCode, response.headers);
                response.pipe(res);
            });
            req.pipe(connector);
        } else {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Hello World\n');
        }
    }).listen(port, hostname);
    console.log('proxy routes server running at http://%s:%s/', hostname, port);
};
