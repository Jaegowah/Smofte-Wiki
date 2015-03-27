var express = require('express');
var router = express.Router();
var marked = require('marked');
var fs = require('fs');

var pagepath = "data/";

function path_to_page(pagename)
{
	return pagepath + pagename + ".md";
}

// alrighty someone tries to save their edits!
router.post('/:page', function(req, res, next)
{
	var flash=""
	console.log(req.headers);
	if (req.hasOwnProperty("body"))
	{
		console.log("attempting to save...");
		newcontent = req.body.md
		path = path_to_page(req.params.page);
		fs.writeFile(path, newcontent, function(err) {
		    if(err) {
		        return console.log(err);
				flash = "Something went wrong saving: " + err; 
		    }
		    else
		    {
		    	console.log("The file was saved to "+path+"!");
		    	flash = "Page save successfully.";
		    }
			
			loadpage(res, req.params.page, next, flash);

		}); 
	}
	else
	{
		flash = "wtf";
		loadpage(res, req.params.page, next, flash);
	}
});


/* GET home page. */
router.get('/', function(req, res, next) {
	
	loadpage(res, 'index', next);
});

router.get('/:page', function(req, res, next) {


	loadpage(res, req.params.page, next);

});

router.get('/:page/edit', function(req, res, next)
{
	console.log("Loading for Edit: " + path);
	var path = path_to_page(req.params.page);
	fs.readFile(path, 'utf8', function(err, data)
	{
		if (err)
		{
			// page doesn't exist, doesn't matter had sex 
			next(req, res, next);
			var mdcontent = ""
		}
		else
		{
  			var mdcontent = marked(data);
		}

  		// var title = "Seite ist " + req.path;
  		res.render('edit', { pagename: req.params.page, rawmd: data });
	});
});



function loadpage(res, pagename, next, flash)
{
	var path = path_to_page(pagename);

	if (! /^[a-zA-Z0-9-_]+$/.test(pagename)) 
	{
    	// not a valid pagename
    	console.log("not a page");
    	return next();
	}

	fs.readFile(path, 'utf8', function(err, data)
	{


		console.log("Loading " + path);

		if (err)
			{
				// so the page is not existing
				// but it is a valid page name, we've checked that
				// so let's create a new page
				res.render('new', {pagename: pagename});
			}
		else
		{
			var mdcontent = marked(data);
	  		// var title = "Seite ist " + req.path;
	  		res.render('index', { pagename: pagename, content: mdcontent, flash: flash});
		}
	});
}

module.exports = router;
