/**
 * Created by teixeiras on 24/05/15.
 */
var ChildProcess = require('child_process');

function executeCommand(command) {
    var  stdout = ChildProcess.execSync(command);
    return stdout.toString('utf8');
}
module.exports = {
    measureClock: function (argument) {
        var clock = executeCommand("vcgencmd measure_clock " + argument);
        var matches = clock.match(/(.*)=(.*)/);
        if (!matches)
            return;
        return matches[2];

    },
    measureVolt: function (argument) {
        var clock = executeCommand("vcgencmd measure_volts " + argument);
        var matches = clock.match(/(.*)=(.*)/);
        if (!matches)
            return;
        return matches[2];
    },
    measureTemp : function () {
        var clock = executeCommand("vcgencmd measure_temp");
        var matches = clock.match(/(.*)=(.*)/);
        if (!matches)
            return;
        return matches[2];

    },
    codecEnabled: function (argument) {
        var clock = executeCommand("vcgencmd codec_enabled " + argument);
        var matches = clock.match(/(.*)=(.*)/);
        if (!matches)
            return;
        return matches[2];

    },
    getMem: function (argument) {
        var clock = executeCommand("vcgencmd get_mem " + argument);
        var matches = clock.match(/(.*)=(.*)/);
        if (!matches)
            return;
        return matches[2];

    },
    getConfig: function (argument) {
        var clock = executeCommand("vcgencmd get_config " + argument);
        var lines = clock.split('\n');
        console.log(lines.length);
        var arrayLength = lines.length;
        var entry = {};
        for (var i = 0; i < arrayLength; i++) {
            var matches = lines[i].match(/(.*)=(.*)/);
            if (!matches)
                continue;
            entry[matches[1]]=matches[2];
        }
        return entry;

    }

};
