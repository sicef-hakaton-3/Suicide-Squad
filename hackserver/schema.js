var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    picture: String,
    lat: String,
    lon: String
});

var venueSchema = mongoose.Schema({}, { strict: false });

module.exports.User = mongoose.model('User', userSchema);
module.exports.Venue = mongoose.model('Venue', venueSchema);