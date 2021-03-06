'use strict'

jQuery(document).ready(function() {
    $('.show-register-form').on('click', function(){
    	if( ! $(this).hasClass('active') ) {
    		$('.show-login-form').removeClass('active');
    		$(this).addClass('active');
    		$('.login-form').fadeOut('fast', function(){
    			$('.register-form').fadeIn('fast');
    		});
    	}
    });
    $('.show-login-form').on('click', function(){
    	if( ! $(this).hasClass('active') ) {
    		$('.show-register-form').removeClass('active');
    		$(this).addClass('active');
    		$('.register-form').fadeOut('fast', function(){
    			$('.login-form').fadeIn('fast');
    		});
    	}
    });

    $('#signupBtn').on('click', function() {
        let success = function(token) {
            setTimeout(function() {
                $('#l-form-email').val($('#r-form-email').val());
                $('#l-form-password').val($('#r-form-password').val());
                $('#signInBtn').click();
            }, 200);
        };

        $('#textRegisterBtn').hide();
        $('#loadingRegisterSpinner').show();

        let password = $('#r-form-password').val();
        $.ajax({
            "crossDomain": true,
            "url": RestAPI.registerUser,
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "cache-control": "no-cache"
            },
            "data": JSON.stringify({
                email : $('#r-form-email').val(),
                user : $('#r-form-first-name').val(),
                password : CryptoJS.MD5(password).toString(),
                jobTitle : $('#r-form-job-title').val()
            })
        }).success(success)
        }).error(function(jqXHR, textStatus, ajaxSettings, thrownError) {
            console.log(jqXHR.responseText);
            alert("Wrong credentials: " + jqXHR.responseJSON.message);
            $('#textRegisterBtn').show();
            $('#loadingRegisterSpinner').hide();
        });
    });

    function showUserMessage(message, type) {
        let infoMessageArea = $('.show-info-message');
        infoMessageArea.removeClass('error-message warning-message information-message');
        infoMessageArea.addClass(type);
        infoMessageArea.html(message);
        infoMessageArea.css('margin-top', '0px');
        infoMessageArea.show();

        infoMessageArea.animate({
            "margin-top":"7px"
        }, 'fast');
    }

    function clearUserMessage() {
        $('.show-info-message').html('');
    }

    $('#signInBtn').on('click', function() {
        clearUserMessage();

        let success = function(token) {
            let email = $('#l-form-email').val();
            sessionStorage.setItem('wakanda-user-email', email);
            sessionStorage.setItem('wakanda-user-token', token);

            var data = ("&info=" + token).concat(";").concat(email);
            $(window).attr('location','/pages/redirect-dashboard.html?' + data);
        };

        let error = function(jqXHR, textStatus, ajaxSettings, thrownError) {
            if(jqXHR.status === 401) {
                showUserMessage('Email or Password incorrect, please try again', 'error-message');
            } else {
                showUserMessage('Sorry the servers are in maintenance, please try again later', 'warning-message');
            }

            $('#loadingLoginSpinner').hide();
            $('#textLoginBtn').show();
        };

        let ajaxData = {
            "crossDomain": true,
            "url": RestAPI.login,
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "cache-control": "no-cache"
            },
            "data": {
                "email": $('#l-form-email').val(),
                "password": CryptoJS.MD5($('#l-form-password').val()).toString()
            },
        };

        $('#textLoginBtn').hide();
        $('#loadingLoginSpinner').show();
        setTimeout(function(){
            $.ajax(ajaxData).done(function() {
            }).success(success).error(error);
        }, 100);


    });
