fs = require('fs');
var marked = require('marked');
var mkdirp = require('mkdirp');

var PageManager = function()
{

	// load page with newest revision
	this.getPage = function(name, success, notfound, rvnr)
	{
		var pm = this;

		p = new Page(name);
		fs.readFile(p.metapath(), 'utf8', function(err, data)
		{
			console.log("Loading Metadata");

			if (err) // Seite existiert nicht
			{
				notfound(); // callback
			}
			else // file was loaded
			{
				//console.log("This is how I roll: " + data);
				lo = JSON.parse(data);
				p.categories = lo.categories;
				p.revisions = lo.revisions;

				console.log(JSON.stringify(p));
				//callback.bind(this);

				// if no specific revision is asked for, use the latest one
				// #reviewthiscode
				var rev;
				if (rvnr === undefined)
				{
					rev = p.newestRevision();
				}
				else
				{
					var i;
					for (i=0; i<p.revisions.length; i++)
					{
						if (p.revisions[i].timestamp == rvnr)
						{
							rev = p.revisions[i];
						}
					}
					if (rev == null)
					{
						rev = p.newestRevision();
					}
				}



				p.version = rev.timestamp;
				p.user = rev.user;

				pm.loadRevision(p, success);
			}
		});
	}

	this.saveNewPageRevision = function(pagename, newcontent, callback)
	{
		var pm = this;

		p = new Page(pagename);
		fs.readFile(p.metapath(), 'utf8', function(err, data)
		{
			console.log("Loading Metadata");

			if (err)
			{
				// page doesn't exist yet

				console.log("Creating new Metadata for page " + pagename);
				if(!fs.existsSync(p.path()))
				{
					fs.mkdirSync(p.path());
				}
			}
			else // file was loaded
			{
				//console.log("This is how I roll: " + data);
				lo = JSON.parse(data);
				p.categories = lo.categories;
				p.revisions = lo.revisions;
			}

			// create new revision and add to temporary page object
			newRev = new Revision;
			user = "anon"; //todo
			newRev.user = user;
			p.user = user;
			var now = Date.now();
			newRev.timestamp = now;
			p.version = now;
			console.log("New Revision: " + JSON.stringify(newRev));
			p.revisions.push(newRev);
			p.content = marked(newcontent);

			// asynchronically save stuff while already rendering
			// wow, such node js! much parallel
			pm.saveVersion(pagename, now, newcontent);
			pm.saveMeta(pagename, p);

			callback(p);
		});
	}

	this.loadRevision = function(page, callback)
	{
		console.log(JSON.stringify(page));

		var path = page.path() + page.version + ".md";

		fs.readFile(path, 'utf8', function(err, data)
		{
			console.log("Loading Revision " + p.version);

			if (err)
			{
				console.log(err);
			}
			else // file was loaded
			{
				page.raw = data;
				page.content = marked(data);
				callback(page);
			}
		});
	}


	this.saveVersion = function(pagename, timestamp, content)
	{
		console.log("Saving Revision " + timestamp + " for page " + pagename);
		path = "data/" + pagename + "/" + timestamp + ".md";
		console.log("- using path " + path);
		fs.writeFile(path, content, function(err) {
		    if(err) {
		        return console.log(err);
				flash = "Something went wrong saving: " + err; 
		    }
		    else
		    {
		    	console.log("The version was saved to "+path+"!");
		    }
		});
	}

	this.saveMeta = function(pagename, page)
	{
		path = "data/" + pagename + "/" + "meta.json";
		console.log("Saving meta information for " + pagename);
		console.log("- using path " + path);

		content = page.json();
		fs.writeFile(path, content, function(err) {
		    if(err) {
		        return console.log(err);
				flash = "Something went wrong saving: " + err; 
		    }
		    else
		    {
		    	console.log("The meta was saved to "+path+"!");
		    }
		});
	}
}


var Page = function(name) 
{
    
	// konstruktor shit
	// try to load page

	this.name = name;
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

	// this.save = function()
	// {
	// 	console.log("attempting to save...");
	// 	fs.mkdirSync(this.path());
	// 	fs.writeFile(this.metapath(), this.json(), function(err)
	// 	{
	// 	    if(err)
	// 	    {
	// 	        return console.log(err);
	// 	    }
	// 	    else
	// 	    {
	// 	    	console.log("The file was saved to "+metapath+"!");
	// 	    }
	// 	});
	// }

	this.newestRevision = function()
	{
		return this.revisions[this.revisions.length -1];
	}

}

var Revision = function(timestamp, user_id)
{
	this.timestamp = timestamp;
	this.user_id = user_id;
}

// test script

// neue seite
// var blubb = new Page("test");
// blubb.load(function () {	
// 	console.log("da: " + this.title + blubb.categories + blubb.revisions + " eof.");
// });

module.exports = PageManager;