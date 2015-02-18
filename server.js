var http = require( "http" );
var url = require( "url" );

function start(route, handle) {

	function onRequest(request, response) {
		
		var pathname = url.parse(request.url).pathname;
		console.log( "Request for " + pathname + " received." );

		route(handle, pathname, response);

		// response.writeHead( 200, { "Content-Type" : "text/plain" });
		// response.write( "Hello World" );
		// response.end();
	}

	http.createServer(onRequest).listen(14004);
	console.log( "Server has started. Smofte!" );
}

exports.start = start;
