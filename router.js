var http = require('http');

var routes = require('./routes.json');

module.exports = function (req, res) {
    var req_str = [req.method, req.headers.host, req.url].join(' ');
    console.log(req_str);
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i];
        if (req_str.match(new RegExp(route.regex))) {
            var options = {port: route.port, path: req.url, method: req.method};
            var connector = http.request(options, function (response) {
                res.writeHeader(response.statusCode, response.headers);
                response.pipe(res);
            });
            req.pipe(connector);
            return;
        }
    }
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
};
