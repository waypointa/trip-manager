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
var port = 80;
var version = process.env.VERSION || 'unknown';
var firebaseURL = process.env.FIREBASE_URL

// config the routes
var router = express.Router();
var diagRouter = express.Router();

// setup the routes
router.post('/', function(req, res) {

	// Create a new key
	var offersRef = new Firebase(firebaseURL);
	var offerList = offersRef.push({ });
	var offerListId = offerList.key();
	var offerListURL = firebaseURL + offerListId;
	var offerListRef = new Firebase(offerListURL);

	// EXAMPLE: Of pushing a result
	// offerListRef.push({
	// 	cost: 49,
	// 	description: "Platinum Offer",
	// 	aircraft: "A388",
	// 	flight: "QF8",
	// 	logo: "qantas.png"
	// });

	// Respond with the URL
	res.json({
		offerListURL: offerListURL
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
app.use('/offers', router);
app.use('/diag', diagRouter);

// start the server
app.listen(port);
