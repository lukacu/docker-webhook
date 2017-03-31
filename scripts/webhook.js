var execFile = require('child_process').execFile;
var repository = process.env.GITHUB_USERNAME + "/" + process.env.GITHUB_REPOSITORY;
var fs = require('fs');

var http = require('http')
var createHandler = require('github-webhook-handler')

var handler = createHandler({ path: '/', secret: process.env.GITHUB_SECRET });

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(9001)

function run_update() {
	if (fs.existsSync('/scripts/update.sh')) {
		execFile('/scripts/update.sh', function(error, stdout, stderr) { console.log(error); });
	}
}

handler.on('ping', function (event) {
     run_update()
}).on('push', function (event) {
    if( event.payload.branch === process.env.GITHUB_BRANCH ) { run_update(); }
});

