function Config () {

}

Config.prototype.getWebsocketAddress = function () {
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
        return 'ws://10.211.55.6:9090/echo';
    } else  {
        return 'ws://'+location.hostname+':9595/echo';


    }
    return
}
config = new Config();