var express = require('express');
var router = express.Router();
var request = require("request");
var Flickr = require("flickrapi");
var foursquare = (require('foursquarevenues'))('I1LBBPBDFUH3TNLAZEMQ0TG5RU3J3TRENGESX1052JJSUQ0S', 'JEK24NUPFF1IIWHXLN3BPWHRGFU0AHOUOPUGRP332ZGH5SKV');
var historicalCategories = ["4bf58dd8d48988d12d941735", "4bf58dd8d48988d181941735", "4bf58dd8d48988d166941735", "50aaa49e4b90af0d42d5de11", "56aa371be4b08b9a8d573562", "4deefb944765f83613cdba6e", "4bf58dd8d48988d190941735", "4bf58dd8d48988d191941735", "4bf58dd8d48988d192941735", "4bf58dd8d48988d18f941735"];
var histCatNames = ["Monument", "Museum", "Sculpture", "Castle", "Canal", "Historic", "History", "Science", "Planetarium", "Art"];

var flickrOptions = {
    api_key: "0620ac295c10f8d21b08700b10f1ab03",
    secret: "be50186cfe468696",
    user_id: "144813403@N08",
    access_token: "72157673416857091-67da7510bc19dd9e",
    access_token_secret: "7d46de3dfc47b41f"
};

function getLocationPhoto(lat, lng, text, callback) {
    Flickr.authenticate(flickrOptions, function (error, flickr) {
        flickr.photos.search({
            lat: lat,
            lon: lng,
            radius: 1,
            accuracy: 16,
            text: text
        }, function (err, result) {
            if (result.photos.photo.length == 0) {
                callback("");
                return;
            }
            var photo = result.photos.photo[0];
            flickr.photos.getSizes({
                photo_id: photo.id
            }, function (er, data) {
                var url = data.sizes.size[3];
                callback(url);
                });
    });
    });
}

function measure(lat1, lon1, lat2, lon2) {  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d * 1000; // meters
}
function getClosestLocation(location, other_locations) {
    var min = measure(location.lat, location.lng, other_locations[0].lat, other_locations[0].lng);
    //console.log(location);
    var imin = 0;
    for (var i = 1; i < other_locations.length; i++) {
        var dist = measure(location.lat, location.lng, other_locations[i].lat, other_locations[i].lng);
        if (dist < min) {
            min = dist;
            imin = i;
        }
    }
    return imin;
}
//foursquare test
/*foursquare.getCategories({}, function (error, venues) {
    venues.response.categories.forEach(function (object) {
        console.log(object.id + "   " + object.name);
    });
});*/
//
//getFoursquareVenues(43.324772, 21.895539, 1000);
function getVenue(id, callback) {
    var res = {};
    var params = {
        "venue_id": id
    };
    foursquare.getVenue(params, function (error, venues) {
        var object = venues.response.venue;
        var Venue = {};
        Venue.id = object.id;
        Venue.name = object.name;
        Venue.contact = object.contact;
        Venue.location = object.location;
        Venue.categories = object.categories;
        Venue.url = object.url;
        try {
            Venue.hours = object.hours;
        } catch (e) {
            Venue.hours = {};
        }
        try {
            Venue.rating = object.rating;
        } catch (e) {
            Venue.rating = {};
        }
        try {
            Venue.description = object.description;
        } catch (e) {
            Venue.description = {};
        }
        try {
            Venue.tags = object.tags;
        } catch (e) {
            Venue.tags = {};
        }
        try {
            Venue.photos = object.photos;
        } catch (e) {
            Venue.photos = {};
        }
        res.Venue = Venue;

        request("https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro&titles=2016_Chicago_Cubs_season", function (error, response, body) {
            var json = JSON.parse(body);
            console.log(json);
            var text = json.query.pages[[Object.keys(json.query.pages)[0]]].extract;

            res.Wikipedia = text;

            console.log(res);
            callback(res);
        });
    });
}

function getLatLng(city, callback) {
    var params = {
        "near": city
    };
    foursquare.getVenues(params, function (error, venues) {
        if (venues.response.venues.length == 0)
            return;
        var lat = venues.response.venues[0].location.lat;
        var lng = venues.response.venues[0].location.lng;
        getFoursquareVenues(lat, lng, 10000, callback);
    });
}
function getFoursquareVenues(lat, lng, radius, callback) {
    var comasaperated = "";
    for (var i = 0; i < historicalCategories.length; i++) {
        if (i < (historicalCategories.length - 1))
            comasaperated += historicalCategories[i] + ',';
        else
            comasaperated += historicalCategories[i];
    }
    if (radius > 100000)
        radius = 99999;
    var params = {
        "ll": lat + "," + lng,
        "radius": radius,
        "categoryId": comasaperated
    };
    console.log("Dule");
    var my_location = { lat: lat, lng: lng };
    foursquare.getVenues(params, function (error, venues) {
        if (!error) {
            var venue_list = new Array(); // array of Venues
            var tempLocArr = new Array();
            var sortedArr = new Array(); // array of soreted venues
            sortedArr.push(my_location);
            for (var i = 0; i < venues.response.venues.length; i++) {
                var object = venues.response.venues[i];
                var Venue = {};
                Venue.id = object.id;
                Venue.name = object.name;
                Venue.contact = object.contact;
                Venue.location = object.location;
                Venue.categories = object.categories;
                Venue.url = object.url;
                try {
                    Venue.hours = object.hours;
                } catch (e) {
                    Venue.hours = {};
                }
                try {
                    Venue.rating = object.rating;
                } catch (e) {
                    Venue.rating = {};
                }
                try {
                    Venue.description = object.description;
                } catch (e) {
                    Venue.description = {};
                }
                try {
                    Venue.tags = object.tags;
                } catch (e) {
                    Venue.tags = {};
                }
                try {
                    Venue.photos = object.photos;
                } catch (e) {
                    Venue.photos = {};
                }

                //var dbVenue = new schema.Venue(Venue);
                //dbVenue.save();
                //
                //check if one of categories is in hostiryList
                var isHistory = false;
                for (var j = 0; j < Venue.categories.length; j++) {
                    var testIndex = historicalCategories.indexOf(Venue.categories[j].id);
                    if (testIndex >= 0) {
                        Venue.type = histCatNames[testIndex];
                        isHistory = true;
                        break;
                    }
                }
                if (!isHistory) {
                    continue;
                }
                venue_list.push(Venue);
                var location = { lat: Venue.location.lat, lng: Venue.location.lng };
                tempLocArr.push(location);
            }
            console.log("<--------Presorted venues------->");
            /*venue_list.forEach(function (obj) {
                console.log(obj.name);
            });*/
            var numOfVenues = tempLocArr.length;
            //sorting venues
            for (var i = 0; i < numOfVenues; i++) {
                var indexOfCloesest = getClosestLocation(my_location, tempLocArr);
                //console.log("Iteracija " + i + ", index najblizi: " + indexOfCloesest);
                sortedArr.push({ id: venue_list[indexOfCloesest].id, name: venue_list[indexOfCloesest].name, lat: venue_list[indexOfCloesest].location.lat, lng: venue_list[indexOfCloesest].location.lng, type: venue_list[indexOfCloesest].type });
                //my_location changing
                my_location = tempLocArr[indexOfCloesest];
                //remove item from tempLocArr
                tempLocArr.splice(indexOfCloesest, 1);
                venue_list.splice(indexOfCloesest, 1);
            }
            console.log("<--------Sorted venues------->");
            sortedArr.forEach(function (obj) {
                console.log(obj);
            });
            callback(sortedArr);
        }
        else {
            console.log(error);
        }
    });
}
router.get('/', function (req, res) {
    getLatLng(req.query.city, function (data) {
        res.status(200).send(data);
    });
});
router.get('/venue', function (req, res) {
    var id = req.query.id;
    getVenue(id, function (data) {
        res.status(200).send(data);
    });
});

router.get('/flickr', function (req, res) {
    getLocationPhoto(req.query.lat, req.query.lng, req.query.text, function (image) {
        res.status(200).send(image);
    });
});

module.exports = router;

