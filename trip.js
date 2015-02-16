var moment = require('moment');

var New = function (username) {
	this.creationDate = moment().unix();
	this.createdBy = username;
}

module.exports.New = New;