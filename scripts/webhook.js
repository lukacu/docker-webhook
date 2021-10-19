var execFile = require('child_process').execFile;
var fs = require('fs');
var http = require('http');

var webhookFactory = require('github-webhook-handler');

var handler = null;

if (process.env.GITHUB_SECRET !== undefined) {
    handler = webhookFactory({ path: '/', secret: process.env.GITHUB_SECRET });
    handler.on('ping', function (event) {
         run_update()
    }).on('push', function (event) {
        if( event.payload.branch === process.env.GITHUB_BRANCH ) { run_update(); }
    });
} else {
    console.log("WARNING: no GITHUB_SECRET given, running in dev mode, any call to webhook url will trigger update script");
}

http.createServer(function (req, res) {
    if (handler) {
        handler(req, res, function (err) {
            res.statusCode = 404;
            res.end('Not found');
        });
    } else {
        runUpdate();
        res.statusCode = 200;
        res.end('OK');
    }
}).listen(9001);

function runUpdate() {
	if (fs.existsSync('/scripts/update.sh')) {
		execFile('/scripts/update.sh', function(error, stdout, stderr) { 
		    if (error) {
		        console.log(error); 
		        console.log(stdout);
		    } 
		});
	}
}


