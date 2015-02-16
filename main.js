var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var Firebase = require('firebase');
var trip = require('./trip');

// config app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
var port = process.env.PORT || 8081;
var version = process.env.VERSION || 'unknown';
var firebaseURL = process.env.FIREBASE_URL || 'trips-waypointa.firebaseio.com';

// config the routes
var router = express.Router();
var diagRouter = express.Router();

// setup the routes
// POST: Create a trip
router.post('/', function (req, res) {
	var tripsRef = new Firebase(firebaseURL);

	// Create a blank trip
	var newTrip = new trip.New('braidenjudd');

	// Create a new key
	var tripList = tripsRef.push(newTrip);
	var tripListId = tripList.key();
	var tripListURL = firebaseURL + '/' + tripListId;

	// Set the location header and send the response
	res.setHeader("Location", tripListURL);
	res.send();
});

// DELETE: Remove the trip
router.delete('/:id', function (req, res) {
	var tripURL = firebaseURL + '/' + req.params.id;
	var tripsRef = new Firebase(tripURL);

	// Determine if the key exists
	tripsRef.once('value', function (snapshot) {
		if (snapshot.exists()) {
			tripsRef.remove(function (error) {
				if (error) {
					res.status(500);
					res.json({
						error: error
					});
				} else {
					res.status(204);
					res.send();
				}
			});
		} else {
			res.status(404);
			res.send();
		}
	});
});

// GET: Get a reference to a trip
router.get('/:id', function (req, res) {
	var tripURL = firebaseURL + '/' + req.params.id;
	var tripsRef = new Firebase(tripURL);

	// Determine if the key exists
	tripsRef.once('value', function (snapshot) {
		if (snapshot.exists()) {
			res.status(200);
			res.setHeader("Location", tripURL);
			res.json({
				location: tripURL
			});
		} else {
			res.status(404);
			res.send();
		}
	});	
});

// setup a diagnostic version url
diagRouter.get('/version', function (req, res) {
	res.json({
		version: version,
		firebaseURL: firebaseURL
	});
});

// register the routers
app.use('/trips', router);
app.use('/diag', diagRouter);

// start the server
app.listen(port);
