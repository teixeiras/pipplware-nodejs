function Config () {

}

Config.prototype.getWebsocketAddress = function () {
    return 'ws://10.211.55.6:9090/echo';
}
config = new Config();