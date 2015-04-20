var express = require('express');
var router = express.Router();
var marked = require('marked');
var fs = require('fs');
var PageManager = require('../models/page.js');

var pagepath = "data/";

function path_to_page(pagename)
{
	return pagepath + pagename + ".md";
}

// alrighty someone tries to save their edits!
router.post('/:page', function(req, res, next)
{
	var flash="";

	if (req.hasOwnProperty("body"))
	{
		console.log("attempting to save...");
		pagename = req.params.page;
		newcontent = req.body.md;
		user = req.body.username;
		msg = req.body.commitmsg;

		pm = new PageManager();
		pm.saveNewPageRevision(pagename, newcontent, user, msg, function(page)
		{
			res.render('page', { pagename: pagename, page: p, flash: "Page saved successfully!"});
		});
	}
	else
	{
		flash = "wtf";
		console.log("Error saving...");
	}
});

/* GET home page. */
router.get('/', function(req, res, next) {
	
	pm = new PageManager();
	var pagename = "index";
	pm.getPage(pagename, function(p) {
		res.render('page', { pagename: pagename, page: p, flash: null});
	});

});

router.get('/:page', function(req, res, next) {


	var pagename = req.params.page;
	//loadpage(res, req.params.page, next);
	if (! /^[a-zA-Z0-9-_]+$/.test(pagename)) 
	{
    	// not a valid pagename
    	console.log("not a page");
    	return next();
	}
	else
	{
		console.log("loading page via object...");
		pm = new PageManager();

		pm.getPage(pagename, 
		// call back if page successfully retrieved
		function(p) 
		{
			res.render('page', { pagename: pagename, page: p, flash: null});
		},
		// callback if page does not exist
		function()
		{
			res.render('new', { pagename: pagename });
		});
	}


});

router.get('/:page/v/:version', function(req, res, next) {


	var pagename = req.params.page;
	var version = req.params.version;
	//loadpage(res, req.params.page, next);
	if (! /^[a-zA-Z0-9-_]+$/.test(pagename)) 
	{
    	// not a valid pagename
    	console.log("not a page");
    	return next();
	}
	else
	{
		console.log("loading page via object...");
		pm = new PageManager();

		pm.load(pagename, function(p) {
			res.render('page', { pagename: pagename, page: p, flash: null});
		}, version);
	}


});

router.get('/:page/edit', function(req, res, next)
{

	var pagename = req.params.page;
	//loadpage(res, req.params.page, next);
	if (! /^[a-zA-Z0-9-_]+$/.test(pagename)) 
	{
    	// not a valid pagename
    	console.log("not a page");
    	return next();
	}
	else
	{
		pm = new PageManager();
		pm.getPage(pagename,

			// callback for successful retrieval
			function(p)
			{

				res.render('edit', { pagename: pagename, page: p, flash: null});
			},

			// callback if page does not exist
			function()
			{
				res.render('edit', { pagename: pagename });
			});
	}
});

// function renderPage(pagename, page, flash)
// {

// }

module.exports = router;
