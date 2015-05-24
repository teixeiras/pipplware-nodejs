/**
 * Created by teixeiras on 23/05/15.
 */
var csv = require('csv');
var ChildProcess = require('child_process');

module.exports = {
    executeCommand: function (command) {
        ChildProcess.exec(command, function (err, stdout, stderr) {

            if (err || stderr){
                console.log(stderr.toString());

                return next( err || stderr.toString() );

            }

            stdout = stdout.toString();
            console.log(stdout);
        });
    },
    kill: function (socket, process) {
        var killCommand = 'kill ' + pid;
        executeCommand(killCommand);
    },
    reboot: function () {
        this.executeCommand('sudo reboot');
    },
    both: function () {
        executeCommand('sudo /usr/local/bin/boottoes_kodi')
    },
    emulation: function () {
        executeCommand('sudo /usr/local/bin/boottoes');

    },
    kodi: function () {
        executeCommand('sudo /usr/local/bin/boottokodi');
    },
    xfce: function () {
        executeCommand('sudo /usr/local/bin/boottoxfce');
    },

    terminal: function () {
        executeCommand('sudo /usr/local/bin/boottoterminal');
    },
    restartXbmc: function(){
        executeCommand('sudo killall -9 kodi');
    }

};
