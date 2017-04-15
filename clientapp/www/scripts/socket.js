/*var socket;

function setUpSocket() {
    socket = io.connect(ipadress + ":" + socketport);
    console.log("Device ready");
    socket.on('connect', function () {
    });

    socket.on('hello', function (msg) {
        alert(msg);
    });

    socket.on('message', function (msg) {
        var id = msg.id;
        if (id === localStorage.getItem("id")) {
            alert(msg.text);
        }
    });

    socket.on('locationUpdate', function (msg) {
        
    });

    socket.on('venues', function (msg) {
        alert("venues socket");
        var mapdiv = $('#map_div');
        populateMap(msg);
    });
}