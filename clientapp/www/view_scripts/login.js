function tryLogin() {
    var url = ipadress + ":" + mainport + "/users/login";
    console.log(url);
    var data = {
        username: $('#login_username').val(),
        password: $('#login_password').val()
        //TrebaLokacija
    };

    if (data.username == "" || data.password == "") {
        $('#loaderContainerLogin').html(
            '<i class="glyphicon glyphicon-warning-sign"></i><br />' +
            'You must enter password and username!'
            );
        return;
    }

    $.ajax({
        beforeSend: function () { startSpinnerLogin(); toggleDisabled(); },
        type: "GET",
        url: url,
        data: data,
        success: function (data) {
            stopSpinnerLogin();
            localStorage.setItem("id", data);
            console.log(localStorage.getItem("id"));
            loadContentView("map");
        },
        error: function () {
            stopSpinnerLogin();
            toggleEnabled();
            $('#loaderContainerLogin').html(
                '<i class="glyphicon glyphicon-warning-sign"></i><br />' +
                'Something went wrong!'
                );
        }
    });
};

function register() {
    $('#login_form').fadeTo(500, 0, function () {
        loadContentView("register");
    });
};

$('#login_form').ready(function () {
    $('#login_bckg').css('width', $(window).width())
    $('#login_bckg').css('height', $(window).height());

    $('#login_form').css('width', $(window).width())
    $('#login_form').css('height', $(window).height());

    $('#login_form').fadeTo(500, 1);

    $('#loaderContainerLogin').css('margin-top', $(window).height() * 0.75);
});

function startSpinnerLogin() {
    $('#loaderContainerLogin').html('<div class="loaderL"></div>');
}

function stopSpinnerLogin() {
    $('#loaderContainerLogin').html('');
}

function toggleEnabled() {
    $("#login_username").prop("disabled", false);
    $("#login_password").prop("disabled", false);
    $("#loginButtonLog").prop("disabled", false);
    $("#loginButtonReg").prop("disabled", false);
}

function toggleDisabled() {
    $("#login_username").prop("disabled", true);
    $("#login_password").prop("disabled", true);
    $("#loginButtonLog").prop("disabled", true);
    $("#loginButtonReg").prop("disabled", true);
}