var locationData = {};

$('#objectInfo').ready(function () {
    $('#modalBckg').css('width', $(window).width());
    $('#modalBckg').css('height', $(window).height());

    $('#objectInfo').css('width', $(window).width());
    $('#objectInfo').css('height', $(window).height());
    $('#objectInfo').fadeTo(500, 1);

    $('#image_holder').css('margin-top', $(window).height() * 0.05);
    $('#image_holder').css('width', $(window).width() * 0.7);
    $('#image_holder').css('height', $(window).height() * 0.3);

    $('#text_holder').css('margin-top', $(window).height() * 0.05);
    $('#text_holder').css('height', $(window).height() * 0.4);
});

$('#wfInfoClose').click(function () {
    $('#objectInfo').fadeTo(500, 0, function () {
        $('#modal').html('');
    });
});

function fillLocData(object) {
    locationData = object;

    var url = ipadress + ":" + mainport + "/wiki/";
    console.log(object.name);
    $.ajax({
        beforeSend: function () { },
        type: "GET",
        url: url,
        data: { title: object.name },
        success: function (data) {
            $('#text_holder').html(data);
        },
        error: function () {
        }
    });

    //add image
    url = ipadress + ":" + mainport + "/venues/flickr/";
    console.log(object.name);
    console.log(object.lat);
    console.log(object.lng);
    $.ajax({
        beforeSend: function () { },
        type: "GET",
        url: url,
        data: { lat: object.lat, lng: object.lng, text: object.name },
        success: function (data) {
            $('#image_tag').attr('src', data.source);
        },
        error: function () {
        }
    });
}

function startSpinnerFlickrImg() {
    $('#image_holder').html('<div class="loaderFlickr"></div>');
}

function stopSpinnerFlickrImg() {
    $('#image_holder').html('<img id="image_tag" src="" alt="" />');
}

function startSpinnerFlickrTxt() {
    $('#text_holder').html('<div class="loaderFlickr"></div>');
}

function stopSpinnerFlickrTxt() {
    $('#text_holder').html('');
}