$('#search_div').ready(function () {
    $('#searchBckg').css('width', $(window).width());
    $('#searchBckg').css('height', $(window).height());

    $('#search_div').css('width', $(window).width());
    $('#search_div').css('height', $(window).height());
    $('#search_div').fadeTo(500, 1);

    $('#searchOptions').css('width', $(window).width());
    $('#searchOptions').css('height', $(window).height() * 0.5);
    $('#searchOptions').css('margin-top', $(window).height() * 0.2);
});

$('#search_submit').click(function () {
    var city = $('#search_city').val();

    if (city == "")
        return;

    var url = ipadress + ":" + mainport + "/venues/";

    $.ajax({
        beforeSend: function () { startSpinnerSearch(); toggleDisabled(); },
        type: "GET",
        url: url,
        data: { city: city },
        success: function (data) {
            $('#search_div').fadeTo(500, 0, function () {
                $('#modal').html('');
            });
            updateMap(data);
        },
        error: function () {
            stopSpinnerSearch();
            toggleEnabled();
            $('#searchOptions').html(
                '<i class="glyphicon glyphicon-warning-sign"></i><br />' +
                'Something went wrong!'
                );
        }
    });
});

$('#closeSearch').click(function () {
    $('#search_div').fadeTo(500, 0, function () {
        $('#modal').html('');
    });
});

function startSpinnerSearch() {
    $('#searchOptions').html('<div class="loaderSrch"></div>');
}

function stopSpinnerSearch() {
    $('#searchOptions').html('');
}

function toggleDisabled() {
    $("#search_city").prop("disabled", true);
    $("#search_submit").prop("disabled", true);
    $("#closeSearch").prop("disabled", true);
}

function toggleEnabled() {
    $("#search_city").prop("disabled", false);
    $("#search_submit").prop("disabled", false);
    $("#closeSearch").prop("disabled", false);
}