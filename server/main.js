/**
 * Created by teixeiras on 16/05/15.
 */
var util = require('util');

var mdns = require('mdns');

var webserver = require('./webserver.js');

var fs = require("fs");

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


function processor_usage_update(socket) {
    var cpu=require('cpu');

    var num=cpu.num();
    var interval = setInterval(function(){
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
                clearInterval(interval);
            }
        });
    }, 5 * 1000);
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


