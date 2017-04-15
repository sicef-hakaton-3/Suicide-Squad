function tryRegister() {
    var url = ipadress + ":" + mainport + "/users/register";

    var data = {
        username: $('#register_username').val(),
        password: $('#register_password').val(),
        email: $('#register_email').val()
        //TrebaLokacija
    };

    if (data.username == "" || data.password == "") {
        $('#loaderContainerRegister').html(
            '<i class="glyphicon glyphicon-warning-sign"></i><br />' +
            'You must enter password and username!'
            );
        return;
    }

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(data.email) || data.email == "") {
        $('#loaderContainerRegister').html(
            '<i class="glyphicon glyphicon-warning-sign"></i><br />' +
            'Invalid email address!'
            );
        return;
    }

    $.ajax({
        beforeSend: function () { startSpinnerRegister(); toggleDisabled(); },
        type: "POST",
        url: url,
        data: JSON.stringify(data),
        success: function (data) {
            localStorage.setItem("id", data);
            loadContentView("map");
        },
        error: function () {
            stopSpinnerRegister();
            toggleEnabled();
            $('#loaderContainerLogin').html(
                '<i class="glyphicon glyphicon-warning-sign"></i><br />' +
                'Something went wrong!'
                );
        }
    });
};

function login() {
    $('#register_form').fadeTo(500, 0, function () {
        loadContentView('login');
    });
}

$('#register_form').ready(function () {
    $('#register_bckg').css('width', $(window).width())
    $('#register_bckg').css('height', $(window).height());

    $('#register_form').css('width', $(window).width())
    $('#register_form').css('height', $(window).height());

    $('#register_form').fadeTo(500, 1);

    $('#loaderContainerRegister').css('margin-top', $(window).height() * 0.75);
});

function startSpinnerRegister() {
    $('#loaderContainerRegister').html('<div class="loaderR"></div>');
}

function stopSpinnerRegister() {
    $('#loaderContainerRegister').html('');
}

function toggleEnabled() {
    $("#register_username").prop("disabled", false);
    $("#register_email").prop("disabled", false);
    $("#register_password").prop("disabled", false);
    $("#registerButtonReg").prop("disabled", false);
    $("#registerButtonBck").prop("disabled", false);
}

function toggleDisabled() {
    $("#register_username").prop("disabled", true);
    $("#register_email").prop("disabled", true);
    $("#register_password").prop("disabled", true);
    $("#registerButtonReg").prop("disabled", true);
    $("#registerButtonBck").prop("disabled", true);
}