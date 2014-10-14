var timers = require('timers');
if (process.send) timers.setInterval(function () {process.send("beat");}, 1000);
var args = process.argv.slice(2);
require(args.shift()).apply(null, args);
