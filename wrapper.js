require('timers').setInterval(function () {process.send("beat");}, 1000);
require('http').createServer()
    .listen(process.argv[3])
    .on("request", require(process.argv[2]))
    .on("connect", require(process.argv[2]));
