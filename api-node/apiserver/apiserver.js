// apiserver.js
// used express.js, node-redis
// ---------------------------

// Include required modules
const express = require('express');	// call express
const db = require('redis');		// call node-redis

const app = express();			// load app using express
const PORT = 8080;			// set listener port

// Create a client for Redis db
const dbclient = db.createClient('6379', 'db');

// Router for handling APIv1 calls
const router = express.Router();

// Log any request made to APIv1 route and store to Redis
router.use(function(req, res, next){
	var unixTime = Date.now();
	var requestIP = req.ip;
	var requestMethod = req.method;
	var endPoint = req.path.replace(/[\/]+$/, "");	// Remove extra slash at the end of URI
	if(endPoint.length == 0) endPoint = "API-root";	// If requested URI is root, store it as API-root
	var key = endPoint + ':logs';
	var value = requestIP + '~' + unixTime;
	dbclient.rpush([key, value]);
	console.log(unixTime + ': ' + requestIP + ' - ' + requestMethod + ' ' + endPoint);
	next();		// pass response to next function
});

// Handles GET calls at /hello-world endpoint
router.get('/hello-world', function (req, res) {
	res.jsonp({"message": "hello world"});
});

// Handles GET calls at /logs endpoint. Fetches the logs from Redis db and return as JSON
router.get('/logs', function (req, res) {
	// Fetch keys of all logs
	dbclient.keys('*:logs', function(err, keys){

		// Callback function to return JSON data after processing
		var postLogsets = function(logsets){
			res.jsonp({"logset": logsets});
		}

		var logsets = [];	// Empty logsets initially
		// Fetch individual log entries grouped by request endpoint
		keys.forEach(function(key, index){
			dbclient.lrange(key, 0, -1, function(err, values){

				// Callback function to create logset (Array of all logs)
				var createLogset = function(logs){
					var splitIndex = key.lastIndexOf(':');
					var endpoint = key.substring(0, splitIndex);
					var logset = {"endpoint": endpoint, "logs": logs};
					logsets.push(logset);
					if(index == (keys.length-1))
						postLogsets(logsets);	// Inform callback function to process further
				}
				var logs = [];	// Empty logs array
				values.forEach(function(value, index){
					var log = {"ip": value.split('~')[0], "timestamp": value.split('~')[1]};
					logs.push(log);
					if(index == (values.length-1))
						createLogset(logs);
				});
				
			});
		});
	});
});

// Handles GET calls at /hello-world/logs endpoint. Fetches the logs from Redis db and return as JSON
router.get('/hello-world/logs', function (req, res) {
	// Fetch keys of all logs
	dbclient.keys('/hello-world:*', function(err, keys){

		// Callback function to return JSON data after processing
		var postLogs = function(logs){
			res.jsonp({"logs": logs});
		}

		// Return empty JSON if there are no log entries for hello-world
		if(keys.length == 0) postLogs();
		var logs = [];
		keys.forEach(function(key, index){
			dbclient.lrange(key, 0, -1, function(err, values){
				// Callback function to create array of all
				var addLogs = function(logs_i){
					Array.prototype.push.apply(logs, logs_i);
					if(index == (keys.length-1))
						postLogs(logs);
				}
				var logs_i = [];
				values.forEach(function(value, index){
					var log = {"ip": value.split('~')[0], "timestamp": value.split('~')[1]};
					logs_i.push(log);
					if(index == (values.length-1))
						addLogs(logs_i);
				});
				
			});
		});
	});
});


// Register routes for API v1
app.use('/v1', router);

// Register static home page containing API info for root
app.use('/', express.static(__dirname + '/'));

// Handles all other calls which are not of the specified routes.
app.use(function(req, res){
	res.jsonp({"error": "resource not found"});
});

// Start server program
app.listen(PORT);
console.log('Running on port: ' + PORT);
