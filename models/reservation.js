var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ReservationsSchema   = new Schema({
	date: {type :String, required: true }
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	chef: {type: mongoose.Schema.Types.ObjectId, ref: 'Chef'},
    comments: {type :String, required: true }
});

module.exports = mongoose.model('Reservation', ReservationsSchema);
