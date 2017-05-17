var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
	name: {type :String, required: true },
	email: {type :String, unique: true, required: true },
	profilePictureURL : {type :String, required: true },
	fbId: {type :String, required: true },
	fbAccessToken: {type :String },
	cellphone: {type :String, required: true },
	favoriteChefs : [Schema.Types.ObjectId],
	cellphoneVerified : {type :Boolean, default: false },
	emailVerified : {type :Boolean, default: false },
	devices : [String]
});

UserSchema.methods.currentReservations = function() {
	// add some stuff to the users name
	const curr = new Date; // get current date
    const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    const last = first + 6; // last day is the first day + 6

    const firstday = new Date(curr.setDate(first)).toUTCString();
    const lastday = new Date(curr.setDate(last)).toUTCString();


	return this._id;
};


module.exports = mongoose.model('User', UserSchema);
