var doT = require("dot"),
	fs = require ("fs");

function start(response) {

	// var appTpl = fs.readFileSync("templates/application.dot", 'utf8');
	// var t = doT.template(appTpl);

	var dots = require("dot").process({ path: "./templates"});


	response.writeHead( 200, { "Content-Type" : "text/html" });
	response.write(dots.application({title: "It works!", content: "yessss!"}));
	//response.write(appTpl);
	response.end();

}

exports.start = start;