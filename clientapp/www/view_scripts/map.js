var map;
var marker;
var svg;
var g;
var userLocation = {};
var arrayOfMarkers = new Array();

var baselayers = {
    "Satelite": L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1Ijoic3VpY2lkZXNxdWFkcyIsImEiOiJjaXVyZGI4bTkwMDBrMnptc3NnMnh3cTYzIn0.bmO4d75NNaL0DHGX5xcZ6Q'
    }),
    "Street view": L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.mapbox-streets-v7',
        accessToken: 'pk.eyJ1Ijoic3VpY2lkZXNxdWFkcyIsImEiOiJjaXVyZGI4bTkwMDBrMnptc3NnMnh3cTYzIn0.bmO4d75NNaL0DHGX5xcZ6Q'
    })
};

function initializeMap(width, height, location) {
    $('#map_id').css('height', height);
    $('#map_id').css('width', width);
    console.log("Map view");

    map = L.map('map_id').setView([43.324772, 21.895539], 13);

    /*L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        accessToken: 'pk.eyJ1Ijoic3VpY2lkZXNxdWFkcyIsImEiOiJjaXVyZGI4bTkwMDBrMnptc3NnMnh3cTYzIn0.bmO4d75NNaL0DHGX5xcZ6Q',
        id: 'mapbox.satellite',
        maxZoom: 18
    }).addTo(map);*/
    L.control.layers(baselayers, overlays).addTo(map);
    baselayers["Satelite"].addTo(map);
    /*d3.json("./view_scripts/points.geojson", function (collection) {
        PointsAnime(collection);
    });*/
    L.easyButton('glyphicon glyphicon-home', function () {
        $('#modal').load("./views/search.html");
    }).addTo(map);
}
//[{lat:40.722390,lng:-73.995170,name:"Jovke"}]
function makeAGsonCollection(arrayOfLocations) {
    var collection = {};
    collection.type = "FeatureCollection";
    collection.crs = { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } };
    collection.features = new Array();
    for (var i = 0; i < arrayOfLocations.length; i++) {
        //za svaku lokaciju, kreiraj gson lokaciju
        var feature = {};
        feature.type = "Feature";
        feature.properties = { "latitude": arrayOfLocations[i].lat, "longitude": arrayOfLocations[i].lng, "time": i + 1, "id": "route1", "name": arrayOfLocations[i].name };
        feature.geometry = { "type": "Point", "coordinates": [arrayOfLocations[i].lng, arrayOfLocations[i].lat] };
        collection.features.push(feature);
    }
    return collection;
}
function PointsAnime(collection) {
    //D3
    svg = d3.select(map.getPanes().overlayPane).append("svg");
    g = svg.append("g").attr("class", "leaflet-zoom-hide");
    var featuresdata = collection.features.filter(function (d) {
        return d.properties.id == "route1"
    });
    console.log("Nesto");
    var transform = d3.geoTransform({
        point: projectPoint
    });
    var d3path = d3.geoPath().projection(transform);
    var toLine = d3.line()
        .x(function (d) {
            return applyLatLngToLayer(d).x
        })
        .y(function (d) {
            return applyLatLngToLayer(d).y
        });
    var ptFeatures = g.selectAll("circle")
        .data(featuresdata)
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("class", "waypoints");
    var linePath = g.selectAll(".lineConnect")
       .data([featuresdata])
       .enter()
       .append("path")
       .attr("class", "lineConnect");
    var marker = g.append("circle")
        .attr("r", 10)
        .attr("id", "marker")
        .attr("class", "travelMarker");

    var originANDdestination = [featuresdata[0], featuresdata[featuresdata.length - 1]];

    var begend = g.selectAll(".drinks")
        .data(originANDdestination)
        .enter()
        .append("circle", ".drinks")
        .attr("r", 5)
        .style("fill", "red")
        .style("opacity", "1");

    // I want names for my coffee and beer
    var text = g.selectAll("text")
        .data(originANDdestination)
        .enter()
        .append("text")
        .text(function (d) {
            return d.properties.name
        })
        .attr("class", "locnames")
        .attr("y", function (d) {
            return -10
        });
    map.on("zoomstart", reset);
    map.on('dragstart', reset);
    reset();
    transition();


    function reset() {
        console.log("Reset");
        var bounds = d3path.bounds(collection),
            topLeft = bounds[0],
            bottomRight = bounds[1];
        text.attr("transform",
            function (d) {
                return "translate(" +
                    applyLatLngToLayer(d).x + "," +
                    applyLatLngToLayer(d).y + ")";
            });
        begend.attr("transform",
            function (d) {
                return "translate(" +
                    applyLatLngToLayer(d).x + "," +
                    applyLatLngToLayer(d).y + ")";
            });

        ptFeatures.attr("transform",
            function (d) {
                return "translate(" +
                    applyLatLngToLayer(d).x + "," +
                    applyLatLngToLayer(d).y + ")";
            });
        marker.attr("transform",
            function () {
                var y = featuresdata[0].geometry.coordinates[1]
                var x = featuresdata[0].geometry.coordinates[0]
                return "translate(" +
                    map.latLngToLayerPoint(new L.LatLng(y, x)).x + "," +
                    map.latLngToLayerPoint(new L.LatLng(y, x)).y + ")";
            });
        svg.attr("width", bottomRight[0] - topLeft[0] + 120)
            .attr("height", bottomRight[1] - topLeft[1] + 120)
            .style("left", topLeft[0] - 50 + "px")
            .style("top", topLeft[1] - 50 + "px");
        linePath.attr("d", toLine);
        g.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");
    }
    function transition() {
        linePath.transition()
            .duration(7500)
            .attrTween("stroke-dasharray", tweenDash)
        /*.each("end", function () {
            console.log("Hteo je opet");
           d3.select(this).call(transition);// infinite loop
        })*/;
    }
    var backP = null;
    function tweenDash() {
        return function (t) {
            //total length of path (single value)
            var l = linePath.node().getTotalLength();

            // this is creating a function called interpolate which takes
            // as input a single value 0-1. The function will interpolate
            // between the numbers embedded in a string. An example might
            // be interpolatString("0,500", "500,500") in which case
            // the first number would interpolate through 0-500 and the
            // second number through 500-500 (always 500). So, then
            // if you used interpolate(0.5) you would get "250, 500"
            // when input into the attrTween above this means give me
            // a line of length 250 followed by a gap of 500. Since the
            // total line length, though is only 500 to begin with this
            // essentially says give me a line of 250px followed by a gap
            // of 250px.
            interpolate = d3.interpolateString("0," + l, l + "," + l);
            //t is fraction of time 0-1 since transition began
            var marker = d3.select("#marker");

            // p is the point on the line (coordinates) at a given length
            // along the line. In this case if l=50 and we're midway through
            // the time then this would 25.
            var p = linePath.node().getPointAtLength(t * l);
            //Move the marker to that point
            marker.attr("transform", "translate(" + p.x + "," + p.y + ")"); //move marker
            //console.log(interpolate(t));
            return interpolate(t);
        }
    } //end tweenDash
    function projectPoint(x, y) {
        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    } //end projectPoint
}
var overlays = {};
var markerIcon = L.icon({
    iconUrl: '/android_asset/www/images/marker.svg',
    //shadowUrl: '/android_asset/www/images/red-marker-black-border-hi_shadow.png',

    iconSize: [41, 51], // size of the icon
    shadowSize: [41, 51], // size of the shadow
    iconAnchor: [20, 51], // point of the icon which will correspond to marker's location
    shadowAnchor: [18, 49],  // the same for the shadow
    popupAnchor: [-0, -51] // point from which the popup should open relative to the iconAnchor
});
function markerOnClick(index) {
    $('#modal').load("./views/wiki_flicker.html", function () {
        map.closePopup();
        fillLocData(arrayOfMarkers[index]);
    });
}
function setMarker(latitude, longitude) {
    marker = L.marker([latitude, longitude], { icon: markerIcon }).on('click', markerOnClick).addTo(map);
    L.circle([longitude, latitude], 100, {
        color: 'blue',
        fillColor: '#f03',
        fillOpacity: 0.5
    }).addTo(map);
}
function applyLatLngToLayer(d) {
    var y = d.geometry.coordinates[1]
    var x = d.geometry.coordinates[0]
    return map.latLngToLayerPoint(new L.LatLng(y, x))


}
function changeMarker(latitude, longitude) {
    if (marker !== undefined && marker !== null) {
        marker.setLatLng([latitude, longitude]).update();
    }
}

navigator.geolocation.getCurrentPosition(geoLocationSuccess, function () { alert("Error") });
navigator.geolocation.watchPosition(updateLocationSuccess);

function geoLocationSuccess(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    userLocation.latitude = position.coords.latitude;
    userLocation.longitude = position.coords.longitude;
}

function updateLocationSuccess(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    //
    //var distance = measure(userLocation.latitude, userLocation.longitude, position.coords.latitude, position.coords.longitude);
    //
    userLocation.latitude = position.coords.latitude;
    userLocation.longitude = position.coords.longitude;

    changeMarker(userLocation.latitude, userLocation.longitude);
}

initializeMap(contentWidth, contentHeight, userLocation);
function removeMarkers() {
    for (var i = 0; i < arrayOfMarkers.length; i++) {
        map.removeLayer(arrayOfMarkers[i]);
    }
    arrayOfMarkers = new Array();
}
function updateMap(objects) {
    removeMarkers();
    map.panTo(objects[0]);
    console.log(objects.length);
    objects.shift();
    console.log(objects.length);
    populateMap(objects);
}

function populateMap(objects) {
    console.log(markerIcon);
    for (var i = 0; i < objects.length; i++) {
        //var m = L.marker([objects[i].lat, objects[i].lng], { icon: markerIcon }).on('click', markerOnClick).addTo(map);
        var m = L.marker([objects[i].lat, objects[i].lng], { icon: markerIcon }).bindPopup("<p>" + objects[i].name + "</p><button onclick='markerOnClick(" + i + ")'>See more</button>").addTo(map);
        m.id = objects[i].id;
        m.name = objects[i].name;
        m.lat = objects[i].lat;
        m.lng = objects[i].lng;
        arrayOfMarkers.push(m);
    }
}