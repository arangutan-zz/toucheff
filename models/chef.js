var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ChefSchema   = new Schema({
	name: {type :String, required: true },
	email: {type :String, unique: true, required: true },
	profilePictureURL : {type :String, required: true },
	password: {type :String, required: true},
	fbId : {type :String },
	cellphone: {type :String, required: true},
	address: {
		short : {type :String, required: true},
		long : {type :String, required: true}
	},
	attendingSchedule :[{
		hours : [Number],
		date : {type :String, required: true}
	}],
	neighbourhood: {type :String, required: true},
	lat: {type: Number, required: true},
	long: {type: Number, required: true},
	bio: {type: String, required: true},
	idCardNumber: {type: String, required: true}
});

module.exports = mongoose.model('Chef', ChefSchema);
