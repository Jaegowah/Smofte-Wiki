var express = require('express');
var router = express.Router();
var marked = require('marked');
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
	
	loadpage(res, 'data/index.md', next);
});

router.get('/:page', function(req, res, next) {
	path = "data/" + req.params.page + ".md";
	loadpage(res, path, next);
});

function loadpage(res, path, next)
{
	fs.readFile(path, 'utf8', function(err, data)
	{


		console.log("Loading " + path);

		if (err)
			{
				console.log("Error!")
				return next
			}

  		var mdcontent = marked(data);
  		// var title = "Seite ist " + req.path;
  		res.render('index', { title: "smofte", content: mdcontent });
	});
}

module.exports = router;
