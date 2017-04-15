var express = require('express');
var app = express();
var mongoose = require('mongoose');
var userController = require('./controllers/user_controller');
var morgan = require('morgan');
var bodyParser = require("body-parser");
var socket = require("./socket.js");
var venues = require('./controllers/venues_controller');
var request = require("request");

app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

mongoose.connect('mongodb://suicidesquad:hackaton123@ds039145.mlab.com:39145/hakaton');

var db = mongoose.connection;

db.on('error', function () {
    console.log("Error connecting to database");
});

db.once('open', function () {
    console.log("Connected to the database successfully");
});

app.listen(3000, function () {
    console.log('Server started');
});

app.use('/users', userController);
app.use('/venues', venues);

app.get('/wiki', function (req, res) {
    var query = req.query;
    var title = query.title;
    var newString = "";
    for (var i = 0, len = title.length; i < len; i++) {
        //console.log(title[i]); 
        newString += title[i] == " " ? "%20" : title[i];
    }
    request("https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro&titles=" + newString, function (error, response, body) {
        try {
            var json = JSON.parse(body);
            console.log(json);
            var text = json.query.pages[[Object.keys(json.query.pages)[0]]].extract;

            res.Wikipedia = text;

            console.log(res);
            res.status(200).send(text);
        }
        catch (err) {
            console.log(err);
        }
    });
});