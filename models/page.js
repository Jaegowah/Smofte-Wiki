fs = require('fs');


var Page = function(name) 
{
    
	// konstruktor shit
	// try to load page

	this.name = name;
	this.title = "";
	this.categories = "";
	this.revisions = [];
	this.current = function()
	{
		return new Revision("123", "bla");
	}

	// this.revisions.push(new Revision(123, 4));
	// this.revisions.push(new Revision(125, 3));

	this.path = function()
	{
		return "data/" + this.name + "/";
	}

	this.metapath = function()
	{
		return this.path() + "meta.json";
	}

	this.json = function()
	{
		return JSON.stringify(this);
	}

	this.load = function(callback)
	{
		fs.readFile(this.metapath(), 'utf8', function(err, data)
		{
			console.log("Loading ");

			if (err)
			{
				console.log(err);
			}
			else // file was loaded
			{
				//console.log("This is how I roll: " + data);
				lo = JSON.parse(data);
				console.log("title: " + lo.title);
				this.title = lo.title;
				this.categories = lo.categories;
				this.revisions = lo.revisions;
				console.log(this.title);
				console.log("loaded.");
				//callback.bind(this);
				var self = this;
				callback(lo);
			}
		});
	}

	this.save = function()
	{
		console.log("attempting to save...");
		fs.mkdirSync(this.path());
		fs.writeFile(this.metapath(), this.json(), function(err)
		{
		    if(err)
		    {
		        return console.log(err);
		    }
		    else
		    {
		    	console.log("The file was saved to "+metapath+"!");
		    }
		});
	}

}

var Revision = function(timestamp, user_id)
{
	this.timestamp = timestamp;
	this.user_id = user_id;

	this.content = function()
	{
		return "bla bla bla *bla* bla.";
	}
}

// test script

// neue seite
// var blubb = new Page("test");
// blubb.load(function () {	
// 	console.log("da: " + this.title + blubb.categories + blubb.revisions + " eof.");
// });

module.exports = Page;