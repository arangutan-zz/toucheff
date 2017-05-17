var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ReservationsSchema   = new Schema({
	date: {type :String, required: true },
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	chef: {type: mongoose.Schema.Types.ObjectId, ref: 'Chef'},
	menu: {type: mongoose.Schema.Types.ObjectId, ref: 'Menu'},
    comments: {type :String, required: true }
});

// ReservationsSchema.methods.dudify = function() {
//   // add some stuff to the users name
//   this.name = this.name + '-dude';
//
//   return this.name;
// };

module.exports = mongoose.model('Reservation', ReservationsSchema);
