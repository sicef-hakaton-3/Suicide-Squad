// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var contentWidth;
var contentHeight;
var loadContentView;
var ipadress = "http://10.66.124.53";
var mainport = "3000";
var socketport = "3001";

(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    loadContentView = function(view) {
        $("#view_content").load("./views/" + view + ".html", function (data) {
            console.log("Ucitan view");
        });

        /*$.getScript("../view_scripts/" + view + ".js", function () {
            console.log("Script loaded");
        });*/
        //loadScript(view);
    }

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var heightDoc = $(window).height();
        var widthDoc = $(window).width();
        $('#divContainer').css('height', heightDoc);
        contentWidth = widthDoc;
        contentHeight = heightDoc;

        loadContentView("login");
        //setUpMenu();

        window.onorientationchange = readDeviceOrientation;

        //setUpSocket();
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

    function readDeviceOrientation() {
        var heightDoc = window.innerHeight;//$(window).height();
        var widthDoc = window.innerWidth;//$(window).width();
        $('#divContainer').css('height', heightDoc);
        $('#view_content').css('height', heightDoc);
        contentWidth = widthDoc;
        contentHeight = heightDoc;

        $('#map_id').css('height', contentHeight);
        $('#map_id').css('width', contentWidth);
    }

    function setUpMenu() {
        $("#menu_1").click(function () {
            loadContentView("map");
        });
        $("#menu_2").click(function () {
            loadContentView("login");
        });
        $("#menu_3").click(function () {
            loadContentView("camera");
        });
        $("#menu_4").click(function () {
            loadContentView("svg");
        });
        $("#menu_5").click(function () {
            loadContentView("list_users");
        });
        $("#menu_6").click(function () {
            loadContentView("profile");
        });
    }
    
    function geoLocationSuccess(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        userLocation.latitude = position.coords.latitude;
        userLocation.longitude = position.coords.longitude;

        socket.emit('locationUpdate', { id: localStorage.getItem("id"), lat: userLocation.latitude, lon: userLocation.longitude });
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

    function updateLocationSuccess(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        //
        var distance = measure(userLocation.latitude, userLocation.longitude, position.coords.latitude, position.coords.longitude);
        //
        userLocation.latitude = position.coords.latitude;
        userLocation.longitude = position.coords.longitude;

        changeMarker(userLocation.latitude, userLocation.longitude);
        if (distance > 10)
            socket.emit('locationUpdate', { id: localStorage.getItem("id"), lat: userLocation.latitude, lon: userLocation.longitude });
        else
            console.log("Distanca je manja od 10m");
    }

    function loadScript(file) {
        var jsElm = document.createElement("script");
        jsElm.type = "application/javascript";
        jsElm.src = "../view_scripts/" + file + ".js"
        document.body.appendChild(jsElm);
    }
})();