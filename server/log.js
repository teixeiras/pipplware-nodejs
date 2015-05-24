// log.js
// ========

var posix = require('posix');
/**
 * 'emerg'
 'alert'
 'crit'
 'err'
 'warning'
 'notice'
 'info'
 'debug'
 */
posix.openlog("node-syslog", {cons: true, pid:true}, 'user');


module.exports = {
    info: function (text) {
        //posix.log(Syslog.LOG_INFO, text);
        console.log(text);
    },
    error: function (text) {
        //Syslog.log(Syslog.LOG_INFO, text);
        console.log(text);
    },
    close: function () {
        posix.closelog();
    }

};




