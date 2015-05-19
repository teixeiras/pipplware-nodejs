// log.js
// ========

var Syslog = require('node-syslog');

Syslog.init("node-syslog", Syslog.LOG_PID | Syslog.LOG_ODELAY, Syslog.LOG_LOCAL0);

module.exports = {
    info: function (text) {
        //Syslog.log(Syslog.LOG_INFO, text);
        console.log(text);
    },
    error: function (text) {
        //Syslog.log(Syslog.LOG_INFO, text);
        console.log(text);
    },
    close: function () {
        //Syslog.close();
    }

};
