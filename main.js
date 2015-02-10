var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var Firebase = require("firebase");
var moment = require("moment");

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
router.post('/', function(req, res) {
	var tripsRef = new Firebase(firebaseURL);
    
    // Create a new key
	var tripList = tripsRef.push({ });
	var tripListId = tripList.key();
	var tripListURL = firebaseURL + '/' + tripListId;

    res.setHeader("Location", tripListURL);
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
