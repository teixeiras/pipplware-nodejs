function PipWebSocket(server, port, ready) {
    this.ws = new WebSocket("ws://"+server+":"+port+"/echo");
    this.handlers = {};

    var self = this;
    this.ws.onopen = function() {
        // Web Socket is connected, send data using send()
        self.ws.send("Message to send");
        if (ready) {
            ready();
        }

    };

    this.ws.onmessage = function (evt)  {
        var received_msg = evt.data;
        var obj = JSON.parse(received_msg);

        if (obj["action"]) {
            for (var key in self.handlers) {
                if (self.handlers.hasOwnProperty(key)) {
                    (self.handlers[key])(obj["status"], obj["content"]);
                }
            }
        }

    };

    this.ws.onclose = function()  {
        // websocket is closed.
    };

}
PipWebSocket.prototype.addHandler = function(key, handler) {
    this.handlers[key] = handler;
};

PipWebSocket.prototype.emit= function(action, content) {
    this.ws.send(JSON.stringify({
        action: action,
        status: 1,
        content: content
    }));

};