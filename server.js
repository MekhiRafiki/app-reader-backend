var express = require('express');
var bodyParser = require("body-parser");
var path = require("path");
var app = express();

app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'x-requested-with');
	res.header('Access-Control-Allow-Methods', 'GET, POST');
	next();
});

var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;

var port = process.env.PORT || 3000;
var database, applications;

var MONGO_URL = 'mongodb+srv://mekhijones:Playinggames1!@cluster0-tf9yh.mongodb.net/ThePhoenixScholars';
var APPLICATION_COLLECTION_NAME = 'scholarApplications';
var READERS_COLLECTION_NAME = 'appReaders';
var LOGIN_PASSWORD = "Playinggames1!";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

MongoClient.connect(MONGO_URL, function(err, db) {
	database = db;
	applications = database.collection(APPLICATION_COLLECTION_NAME);
	readers = database.collection(READERS_COLLECTION_NAME);
	console.log("Connected to MongoDB...");
	app.listen(port, function () {
		console.log('App listening on port 3000!')
	})
});

app.get('/',function(req, res) {   
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/leaderboard', (req, res) => {
	readers.find({}).sort({
		num_reads: -1
	}).toArray().then(data => {
		res.send(JSON.stringify(data));
	});
});

app.get('/stats', (req, res) => {
	applications.find({
		$and: [
			{
				$or: [
					{
						num_reads: {
							$lt: 3
						}
					},
					{
						num_reads: {
							$exists: false
						}
					}
				]
			}
		]
	}).count().then(num => {
		res.send({
			"results": {
				"num_remaining": JSON.stringify(num)
			}
		});
	})
});

app.post('/rate', (req, res) => {
	applications.updateOne({ 
		_id: ObjectId(req.body.application_id)
	}, { 
		$inc: { 
			num_reads: 1 
		},
		$push: {
			ratings: {
				reader_id: req.body.reader_id,
				culture_fit: req.body.culture_fit,
				experience: req.body.experience,
				passion: req.body.passion,
				is_organizer: req.body.is_organizer,
				is_beginner: req.body.is_beginner
			}
		}
	}, function(err, records) {
		if (records.result.n == 1) {
			readers.update({
				_id: ObjectId(req.body.reader_id)
			}, {
				$inc: {
					num_reads: 1
				},
				$push: {
					read: req.body.application_id
				}
			}, function(err, records) {
				if (records.result.n == 1) {
					res.send({
						"results": {
							"status": "success"
						}
					});
				} else {
					res.send({
						"results": {
							"status": "failure"
						}
					});
				}
			});
		} else {
			res.send({
				"results": {
					"status": "failure"
				}
			});
		}
	});
});

app.post('/login', (req, res) => {
	if (req.body.password == LOGIN_PASSWORD) {
		readers.find({
			username: req.body.username
		}).toArray().then(data => {
			if (data.length == 0) {
				readers.insert({
					username: req.body.username,
					name: req.body.username,
					num_reads: 0
				}, function(err, records) {
					res.send({
						"results": {
							"reader_id": records.ops[0]._id
						}
					});
				});
			} else {
				res.send({
					"results": {
						"reader_id": data[0]._id
					}
				});
			}
		})
	} else {
		res.send({
			"results": {
				"status": "failed"
			}
		});
	}
});

app.post('/next_application', (req, res) => {
	readers.findOne({
		_id: ObjectId(req.body.reader_id)
	}).then(data => {
		read = [];
		if (data.read) {
			for (var i = 0; i < data.read.length; i++) {
				data.read[i] = ObjectId(data.read[i])
			}	
			read = data.read
		}
		applications.find({
			_id: {
				$nin: read
			},
			$and: [
				{
					$or: [
						{
							num_reads: {
								$lt: 3
							}
						},
						{
							num_reads: {
								$exists: false
							}
						}
					]
				}
			]
		}).limit(20).toArray().then(data => {
			res.send(JSON.stringify(data[Math.floor(Math.random() * data.length)]));
		})
	})
});
