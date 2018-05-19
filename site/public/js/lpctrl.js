"use strict"

addEventListener('load', start);

var baseURL = window.location.href;

function start() {
    var createButton = document.getElementById("create");
    createButton.addEventListener('click', gotoCreate);

    var viewButton = document.getElementById("view");
    viewButton.addEventListener('click', gotoView);

    var createAccountButton = document.getElementById("createAccount");
    createAccountButton.addEventListener('click', createAccounClick);

    var siginButton = document.getElementById("signinButton");
    signinButton.addEventListener('click', signinClick);

    var showSignInText = document.getElementById("signin");
    showSignInText.addEventListener('click', toggleSignin);

    var signinBackground = document.getElementById("signinBackground");
    signinBackground.addEventListener('click', toggleSignin);
}

function gotoView() {
    location.href = '/view';
}

function gotoCreate() {
    location.href = '/play';
}

function createAccounClick() {
    var details = validateSignup();
    if(details == null) return;
    post(baseURL + 'signup', details)
    return;
}

function signinClick() {
    var details = validateSignIn();
    if(details == null) return;
    post(baseURL + 'signin', details)
    return;
}

function validateSignIn() {
    var email = document.getElementById("signinEmail").value;
    if(!validEmail(email)){
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

function validateSignup() {
    var forename = document.getElementById("forename");
    forename.setCustomValidity("");
    if(forename.value == ""){
        forename.focus();
        alert("First name is required");
        return;
    } 
    var lastname = document.getElementById("lastname");
    lastname.setCustomValidity("");
    if(lastname.value == ""){
        lastname.focus();
        alert("Last name is required");
        return;
    } 
    var email = document.getElementById("email");
    email.setCustomValidity("");
    if(!validEmail(email.value)){
        email.focus();
        alert("Invalid Email Address");
        return;
    }
    var password = document.getElementById("password");
    password.setCustomValidity("");
    if(!validPassword(password.value)){
        password.focus();
        alert("Password must: Contain at least 8 characters, Contain at least 1 number, Contain at least 1 lowercase character (a-z), contain at least 1 uppercase character (A-Z)");
        return;
    }
    var passwordRepeat = document.getElementById("passwordrepeat");
    passwordRepeat.setCustomValidity("");
    if(password.value != passwordRepeat.value){
        passwordRepeat.focus();
        alert("Passwords must match");
        return;
    }


    return {
        forename: forename.value,
        lastname: lastname.value,
        email: email.value,
        password: password.value
    }
}

function validEmail(email){
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(!regex.test(email)) return false;
    else return true;
}

function validPassword(password){
    var regex = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    if(!regex.test(password)) return false;
    else return true;
}

function toggleSignin() {
    var popup = document.getElementById("signinBackground");
    popup.classList.toggle("show");
    var siginBox = document.getElementById("siginForm");
    siginBox.classList.toggle("show");
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
        }
        else if(this.readyState == this.DONE && (this.status == 400 || this.status == 401)){
            alert(this.responseText);
        }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
    return xhr;
}