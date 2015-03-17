var express = require('express');
var router = express.Router();
var marked = require('marked');
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
	fs.readFile('data/index.md', 'utf8', function(err, data)
	{
  		var mdcontent = marked(data);
  		console.log(req);
  		res.render('index', { title: 'Smofte!', content: mdcontent });
	});
});

module.exports = router;
