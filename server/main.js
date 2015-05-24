/**
 * Created by teixeiras on 16/05/15.
 */
var ChildProcess = require('child_process');

var util = require('util');

var os = require('os');

var mdns = require('mdns');

var webserver = require('./webserver.js');

var fs = require("fs");

var ShellScripts = require('./modules/shellScripts');

var gamepad_hub = require('./gamepad/app/virtual_gamepad_hub');

var log = require('./log');

var config = require('./config.json');

hub = new gamepad_hub();

var WebSocketServer = require('ws').Server

log.info("starting app" + new Date());

log.info("config app parameters: "+util.inspect(config, false, null));

var port = 9999;

if (config['server'] && config['server']['port']) {
    port = config['server']['port'];
}

log.info("starting server at port: " + port);

var webport = 8081;
if (config['webserver'] && config['webserver']['port']) {
    webport = config['webserver']['port'];
}

webserver.start_server(webport, port);


parser = function (content, ws) {
    switch(content["action"]) {
        case 'sys_state':{
            processor_usage_update(ws);

        }break;
        case 'script': {
            scripts(content["content"]["script"], ws);
        }break;
        case 'genericInformation': {
            genericInformation(ws);
        }break;
        case 'memory':{
            memory(ws);
        }break;
        case 'processList': {
            processList(ws);
        }break;
        case 'disconnect': {

                if (ws.gamePadId !== void 0) {

                    return hub.disconnectGamepad(ws.gamePadId, function() {});

                }
            }break;

        case 'connectGamepad': {

                return hub.connectGamepad(function(gamePadId) {
                    console.log("connected");
                    console.log(gamePadId);
                    if (gamePadId !== -1) {

                        ws.gamePadId = gamePadId;

                        ws.send(JSON.stringify({

                            action: "connectGamepad",

                            status: 1,

                            content: {
                                padId: gamePadId
                            }
                        }));
                    }
                });
            }break;
        case 'padEvent': {

                if (ws.gamePadId !== void 0 && data) {

                    return hub.sendEvent(ws.gamePadId, data);
                }

            }break;
    }
}

function scripts(script, socket) {
    switch (script) {
        case 'reboot': {
            ShellScripts.reboot();

        }break;
        case 'both':{
            ShellScripts.both();
        }break;
        case 'emulation':{
            ShellScripts.emulation();
        }break;
        case 'kodi': {
            ShellScripts.kodi();
        }break;
        case 'xfce':{
            ShellScripts.xfce();
        }break;
        case 'terminal':{
            ShellScripts.terminal();
        }break;
        case 'restartXbmc':{
            ShellScripts.restartXbmc();
        }break;
    }
}

function genericInformation(socket) {
    var vcgencmd = require('./vcgencmd.js');
    try {
        socket.send(JSON.stringify({
            action: "genericInformation",
            status: 1,
            content: {
                measureClock: {
                    core: vcgencmd.measureClock('core'),
                    sdram_c:vcgencmd.measureClock('sdram_c'),
                    sdram_i:vcgencmd.measureClock('sdram_i'),
                    sdram_p: vcgencmd.measureClock('sdram_p')
                },
                measureVolt: {
                    core: vcgencmd.measureVolt('core'),
                    sdram_c:vcgencmd.measureVolt('sdram_c'),
                    sdram_i:vcgencmd.measureVolt('sdram_i'),
                    sdram_p: vcgencmd.measureVolt('sdram_p')
                },
                measureTemp:vcgencmd.measureTemp(),
                codecEnabled:{
                    H264:vcgencmd.codecEnabled('H264'),
                    MPG2:vcgencmd.codecEnabled('MPG2'),
                    WVC1:vcgencmd.codecEnabled('WVC1'),
                    MPG4:vcgencmd.codecEnabled('MPG4'),
                    MJPG:vcgencmd.codecEnabled('MJPG'),
                    WMV9:vcgencmd.codecEnabled('WMV9')
                },
                mem:{
                    arm:vcgencmd.getMem('arm'),
                    gpu:vcgencmd.getMem('gpu')
                },
                config:{
                    int: vcgencmd.getConfig('int'),
                    str: vcgencmd.getConfig('str')
                }
            }
        }));
    } catch (e) {
        console.log(e);
    }
}
function memory(socket) {

    try {
        socket.send(JSON.stringify({
            action: "memory",
            status: 1,
            content: {
                freemem: os.freemem(),
                usedmem: os.totalmem() - os.freemem(),
                totalmem: os.totalmem()
            }
        }));
    } catch (e) {
    }

}

function processList(socket) {

    ChildProcess.exec('ps -Ao pid,pcpu,size,command', function (err, stdout, stderr) {
        if (err || stderr)
            return callback(err || stderr.toString());

        var results = [];
        stdout.split('\n').map(function (row) {
            var matches = row.match(/(\d+) (.*) (\d+) (.*)/);
            if (!matches)
                return;

            results.push({
                pid: parseInt(matches[1], 10),
                cpu:parseFloat(matches[2].trim()),
                mem: parseInt(matches[3], 10),
                command: matches[4]
            });

        });
        try {
            socket.send(JSON.stringify({
                action: "processList",
                status: 1,
                content: {
                    processes: results
                }
            }));
         } catch (e) {
    }
    });

}

function processor_usage_update(socket) {
    var cpu=require('cpu');

    var num=cpu.num();

    cpu.usage(function(arr){
        try {
            socket.send(JSON.stringify({
                action: "sys_state",
                status: 1,
                content: {
                    usage: arr
                }
            }));
        } catch (e) {
        }
    });

}

var wss = new WebSocketServer({ port: port });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        try{
            var object = JSON.parse(message);

            if (object["action"]) {
                parser(object, ws);
            }
        }catch(e) {

        }

    });


});



function announce_bonjour_server(port) {
    log.inf("Starting bonjour server");
    var ad = mdns.createAdvertisement(mdns.tcp('_virtualKeypad'), port);
    ad.start();

}

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (err != undefined) {
        log.error("Pipplware: error: "+err.stack);
    }


    log.close();
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));


var vcgencmd = require('./vcgencmd.js');

console.log(JSON.stringify({
    action: "genericInformation",
    status: 1,
    content: {
        measureClock: {
            core: vcgencmd.measureClock('core'),
            sdram_c:vcgencmd.measureClock('sdram_c'),
            sdram_i:vcgencmd.measureClock('sdram_i'),
            sdram_p: vcgencmd.measureClock('sdram_p')
        },
        measureVolt: {
            core: vcgencmd.measureVolt('core'),
            sdram_c:vcgencmd.measureVolt('sdram_c'),
            sdram_i:vcgencmd.measureVolt('sdram_i'),
            sdram_p: vcgencmd.measureVolt('sdram_p')
        },
        measureTemp:vcgencmd.measureTemp(),
        codecEnabled:{
            H264:vcgencmd.codecEnabled('H264'),
            MPG2:vcgencmd.codecEnabled('MPG2'),
            WVC1:vcgencmd.codecEnabled('WVC1'),
            MPG4:vcgencmd.codecEnabled('MPG4'),
            MJPG:vcgencmd.codecEnabled('MJPG'),
            WMV9:vcgencmd.codecEnabled('WMV9')
        },
        mem:{
            arm:vcgencmd.getMem('arm'),
            gpu:vcgencmd.getMem('gpu')
        },
        config:{
            int: vcgencmd.getConfig('int'),
            str: vcgencmd.getConfig('str')
        }
    }
}));