var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MenuSchema   = new Schema({
	name: {type :String, required: true },
	menuPictureURL: {type :String, required: true },
	description: {type :String, required: true},
	attendingSchedule : {
		hour : [String],
        reservations: [Number],
		date : [String],
	},
	price : {type: Number, required: true},
    chef: {type: mongoose.Schema.Types.ObjectId, ref: 'Chef'}
});

module.exports = mongoose.model('Menu', MenuSchema);
