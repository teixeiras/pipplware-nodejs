var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")

var log = require("./log.js");
module.exports = {
    http: function() {
       return http;
    },
    start_server: function (port, socketPort) {
        log.info("Start webserver at webport: "+port);

        http.createServer(function(request, response) {

            var uri = url.parse(request.url).pathname;
            var partialUrl = path.join(process.cwd(), "static/")
            var filename = path.join(partialUrl, uri);

            path.exists(filename, function(exists) {
                if(!exists) {
                    response.writeHead(404, {"Content-Type": "text/plain"});
                    response.write("404 Not Found\n");
                    response.end();
                    return;
                }

                if (fs.statSync(filename).isDirectory()) filename += '/index.html';

                fs.readFile(filename, "binary", function(err, file) {
                    if(err) {
                        response.writeHead(500, {"Content-Type": "text/plain"});
                        response.write(err + "\n");
                        response.end();
                        return;
                    }
                    var result = file.replace(/%%port%%/g, socketPort);

                    response.writeHead(200);
                    response.write(result, "binary");
                    response.end();
                });
            });
        }).listen(parseInt(port, 10));
    }
}
