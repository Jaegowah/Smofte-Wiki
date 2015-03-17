var express = require('express');
var router = express.Router();
var marked = require('marked');
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
	
	loadpage(res, 'data/index.md');
});

router.get('/*', function(req, res, next) {
	path = "data" + req.path + ".md";
	loadpage(res, path);
});

function loadpage(res, path)
{
	fs.readFile(path, 'utf8', function(err, data)
	{
		console.log("Loading " + path);
  		var mdcontent = marked(data);
  		// var title = "Seite ist " + req.path;
  		res.render('index', { title: "smofte", content: mdcontent });
	});
}

module.exports = router;
