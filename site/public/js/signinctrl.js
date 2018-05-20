"use strict"

addEventListener('load', start);

var baseURL = window.location.origin + '/';

function start() {
    var siginButton = document.getElementById("signinButton");
    signinButton.addEventListener('click', signinClick);

    var createAccountText = document.getElementById("createAccount");
    createAccountText.addEventListener('click', createAccountRedirect);
}

function createAccountRedirect(){
    location.href = baseURL;
}

function signinClick() {
    var details = validateSignIn();
    if (details == null) return;
    post(baseURL + 'signin', details)
    return;
}

function validateSignIn() {
    var email = document.getElementById("signinEmail").value;
    if (!validEmail(email)) {
        document.getElementById("signinEmail").focus();
        alert("Invalid Email Address")
        return;
    }
    var password = document.getElementById("signinPassword").value;
    //no need to check password against constraints as validated by server

    return {
        email: email,
        password: password
    }
}

function validEmail(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!regex.test(email)) return false;
    else return true;
}

function post(url, details) {
    var params = Object.keys(details).map(
        function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(details[key])
        }
    ).join('&');

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.onreadystatechange = function () {
        if (this.readyState == this.DONE && this.status == 200) {
            location.href = this.responseURL;
        } else if (this.readyState == this.DONE && (this.status == 400 || this.status == 401)) {
            alert(this.responseText);
        }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
    return xhr;
}