var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MenuSchema   = new Schema({
	name: {type :String, required: true },
	menuPictureURL: {type :String, unique: true, required: true },
	description : {type :String, required: true },
	description: {type :Double, required: true},
	attendingSchedule :[{
		hour : [Number],
        reservations: [Number],
		date : {type: Date, required: true},
	}],
    chef: {type: mongoose.Schema.Types.ObjectId, ref: 'Chef'}
});


module.exports = mongoose.model('Menu', MenuSchema);
