var exec = require( "child_process" ).exec;

function start(response) {
	exec( "ls -lah" , function (error, stdout, stderr) {
		response.writeHead( 200, { "Content-Type" : "text/plain" });
		response.write(stdout);
		response.write("\nyeah!!1");
		response.end();
	});
}

exports.start = start;