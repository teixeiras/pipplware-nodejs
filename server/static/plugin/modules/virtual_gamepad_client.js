/***********************
 INITIALIZE THE JOYSTICK
 **********************/

var socket;

var setDirection = function() {};
var initJoystick = function () {
    var dirCursor = document.getElementById("dirCenter");
    var container = document.getElementById("dirContainer");
    var joystickBoundLimit = document.getElementById("path3212");

    var joystick = new VirtualJoystick({
        mouseSupport: true,
        stationaryBase: true,
        baseX: $(dirCursor).position().left,
        baseY: $(dirCursor).position().top,
        limitStickTravel: true,
        stickRadius: 50,
        baseElement: dirCursor,
        container: container,
        strokeStyle: '#777f82'
    });

    var lastDirection = "none";
    setInterval(function(){
        /************
        JOYSTICK MODE
         ***********/
        /*
        if (joystick.left() || joystick.right() | joystick.up() || joystick.down()) {
            lastDirection = "dir";
            setDirection({x: parseInt(32767*joystick.deltaX()/50), y: parseInt(32767*joystick.deltaY()/50)});
        } else if (lastDirection != "none"){
            lastDirection = "none";
            setDirection({x: 0, y: 0});
        }
        */
        /************
         DIRECTIONAL PAD MODE
         ***********/
        if(joystick.left()) {
            if (lastDirection != "left") {
                lastDirection = "left";
                setDirection({direction: "left"});
            }
        } else if(joystick.right()) {
            if (lastDirection != "right") {
                lastDirection = "right";
                setDirection({direction: "right"});
            }
        } else if(joystick.up()) {
            if (lastDirection != "up") {
                lastDirection = "up";
                setDirection({direction: "up"});
            }
        } else if(joystick.down()) {
            if (lastDirection != "down") {
                lastDirection = "down";
                setDirection({direction: "down"});
            }
        } else if (lastDirection != "none") {
            lastDirection = "none";
            setDirection({direction: "none"});
        }

    }, 1/30 * 1000);
};

/*************************
 INITIALIZE SLOT INDICATOR
 ************************/
var indicatorOn;
var slotNumber;
var initSlotIndicator = function () {
    indicatorOn = false;
    var slotAnimationLoop = function () {
        if (slotNumber != undefined) {
            $(".indicator").removeClass("indicatorSelected");
            $("#indicator_"+(slotNumber+1)).addClass("indicatorSelected");
        } else {
            if(indicatorOn) {
                $(".indicator").removeClass("indicatorSelected");
            } else {
                $(".indicator").addClass("indicatorSelected");
            }
            indicatorOn = !indicatorOn;
            setTimeout(slotAnimationLoop, 500);
        }
    }
    slotAnimationLoop();
}

/**********************
 HAPTIC CALLBACK METHOD
 *********************/
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
var hapticCallback = function () {
    if (navigator.vibrate) {
        navigator.vibrate(1);
    }
}

/****************
 MAIN ENTRY POINT
 ***************/

var onGamePadConnected = function(success, content) {
    var data = content;
    slotNumber = data.padId;

    $(".btn").off("touchstart touchend");
    setDirection = function () {
    };

    function selectStartButton(btnId, code) {
        $("#" + btnId).attr("class", "btnSelected");
        socket.emit("padEvent", {type: 0x01, code: code, value: 1});
        hapticCallback();
    }

    function selectEndButton(btnId, code) {
        $("#" + btnId).attr("class", "");
        socket.emit("padEvent", {type: 0x01, code: code, value: 0});
        //hapticCallback();
    }

    $(".btn").on("touchstart", function () {
        selectStartButton($(this).data("btn"), $(this).data("code"));
    });

    $(".btn").on("touchend", function () {
        selectEndButton($(this).data("btn"), $(this).data("code"));

    });

    setDirection = function (direction) {
        switch (direction.direction) {
            case "left" :
                socket.emit("padEvent", {type: 0x03, code: 0x00, value: 0});
                socket.emit("padEvent", {type: 0x03, code: 0x01, value: 127});
                break;
            case "right" :
                socket.emit("padEvent", {type: 0x03, code: 0x00, value: 255});
                socket.emit("padEvent", {type: 0x03, code: 0x01, value: 127});
                break;
            case "up" :
                socket.emit("padEvent", {type: 0x03, code: 0x00, value: 127});
                socket.emit("padEvent", {type: 0x03, code: 0x01, value: 0});
                break;
            case "down" :
                socket.emit("padEvent", {type: 0x03, code: 0x00, value: 127});
                socket.emit("padEvent", {type: 0x03, code: 0x01, value: 255});
                break;
            case "none" :
                socket.emit("padEvent", {type: 0x03, code: 0x00, value: 127});
                socket.emit("padEvent", {type: 0x03, code: 0x01, value: 127});
                break;
            default :
                socket.emit("padEvent", {type: 0x03, code: 0x00, value: direction.x});
                socket.emit("padEvent", {type: 0x03, code: 0x01, value: direction.y});
                break;
        }
    };

    setDirection({direction: "none"});
}

function handleKeyPress() {
    /*
     id="btnA" class="btn" data-btn="path3253" data-code="0x130"
     id="btnX" class="btn" data-btn="path3259" data-code="0x133"
     id="btnB" class="btn" data-btn="path3247" data-code="0x131"
     id="btnY" class="btn" data-btn="path3237" data-code="0x134"
     id="btnSELECT" class="btn" data-btn="rect3307" data-code="0x13a"
     id="btnSTART" class="btn" data-btn="rect4170" data-code="0x13b"
     id="btnRT" class="btn" data-btn="path4853" data-code="0x137"
     id="btnLT" class="btn" data-btn="path4756" data-code="0x136"
     */
    $(document).keydown(function (e) {
        switch (e.keyCode) {

            case 87:
                //UP
                setDirection({direction: "up"});
                break;
            case 83:
                //Down
                setDirection({direction: "down"});
                break;
            case 65:
                //Left
                setDirection({direction: "left"});
                break;
            case 68:
                //Right
                setDirection({direction: "right"});
                break;
        }

    });

    $(document).keyup(function (e) {
        switch (e.keyCode) {

            case 87:
            case 83:
            case 65:
            case 68:
                lastDirection = "none";
                setDirection({direction: lastDirection});

                break;
        }

    });
}
function loadGamepadJSClient() {
    initJoystick();
    initSlotIndicator();
    handleKeyPress();

    socket = new PipWebSocket(window.location.hostname, 9090, function (){
        socket.emit("connectGamepad", null);
    });
    socket.addHandler("connectGamepad",onGamePadConnected);

}
$( window ).load(function() {

    loadGamepadJSClient();
} );