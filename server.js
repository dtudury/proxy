var fork = require('child_process').fork;
var timers = require('timers');
var path = require('path');

function run_forever(file) {
    var args = [].slice.call(arguments);
    var fast_fails = 0;
    function start_service() {
        var timeout;
        var start_time = Date.now();
        var fail_alread_handled = false;
        function fail() {
            if (!fail_alread_handled) {
                fail_alread_handled = true;
                if (service.connected) {
                    service.kill('SIGKILL');
                    service.disconnect();
                }
                console.log("fast_fails", fast_fails);
                if (Date.now() - start_time < 5000) {
                    if (fast_fails++ > 5) return;
                } else {
                    fast_fails = 0;
                }
                process.nextTick(start_service);
            }
        }
        function reset_timeout() {
            if (timeout) timers.clearTimeout(timeout);
            timeout = timers.setTimeout(fail, 2000);
        }
        var service = fork(path.join(__dirname, 'wrapper.js'), args);
        service.on('error', fail);
        service.on('exit', fail);
        service.on('close', fail);
        service.on('disconnect', fail);
        service.on('message', reset_timeout);
        reset_timeout();
    }
    start_service();
}
run_forever(path.join(__dirname, './router.js'), 80, '0.0.0.0');
var routes = require('./routes.json');
Object.keys(routes).forEach(function (route) {
    run_forever(routes[route].server, routes[route].port, '0.0.0.0');
});
