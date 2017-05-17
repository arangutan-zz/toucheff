const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const moment	   = require('moment');
const ObjectId = (require('mongoose').Types.ObjectId);

const Menu	   = require('./menu');

var ChefSchema   = new Schema({
	name: {type :String, required: true },
	email: {type :String, unique: true, required: true },
	profilePictureURL : {type :String, required: true },
	fbId : {type :String, required: true},
	fbAccessToken: {type :String, required: true},
	cellphone: {type :String, required: true},
	address: {
		lat : {type :String, required: true},
		long : {type :String, required: true},
		neighbourhood: {type :String, required: true},
		longName : {type :String, required: true},
		shortName : {type :String, required: true}
	},
	attendingSchedule :[{
		hours : [String]
	}],
	bio: {type: String, required: true},
	idCardNumber: {type: String, required: true},
	cancelationHours: {type: Number, default: 24},

	//Aux methods
	distance : Number
});

ChefSchema.methods.currentMenu = function() {
	// add some stuff to the users name
	const curr = new Date; // get current date
    const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    const last = first + 6; // last day is the first day + 6
    let firstday = new Date(curr.setDate(first)).toUTCString();
    let lastday = new Date(curr.setDate(last)).toUTCString();

	firstday = moment(firstday).format('YYYY MM DD');
	lastday = moment(lastday).format('YYYY MM DD');

	Menu.findOne({
		chef : new ObjectId(this._id)
	}, (err,menu) => {
		if (menu) {
			console.log(menu);
			return menu;
		}else {
			return 'no menu';
		}
	});


};


module.exports = mongoose.model('Chef', ChefSchema);
