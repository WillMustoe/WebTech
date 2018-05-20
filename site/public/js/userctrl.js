"use strict"

addEventListener('load', start);

var baseURL = window.location.origin + '/';

function start() {
    get(baseURL + "userdata", updateUserData);
    getImgs();


    var passwordChangeButton = document.getElementById("submit");
    passwordChangeButton.addEventListener('click', passwordChangeClick);
}

function getImgs() {
    get(baseURL + "userimgs", updateUserImgs);
}

function deleteClick(){
    var imgID = this.parentNode.querySelector("#imgID").textContent;
    del(baseURL + "img", {img_id : imgID}, getImgs);
}

function passwordChangeClick() {
    var details = validatePasswords();
    if (details == null) return;
    put(baseURL + "userdata", details);
    clearPasswordFields();
}

function validatePasswords() {
    var oldPassword = document.getElementById("oldpassword");
    var newPassword = document.getElementById("newpassword");
    if (!validPassword(newPassword.value)) {
        newPassword.focus();
        alert("Password must: Contain at least 8 characters, Contain at least 1 number, Contain at least 1 lowercase character (a-z), contain at least 1 uppercase character (A-Z)");
        return;
    }

    var newPasswordRepeat = document.getElementById("newpasswordrepeat");
    if (newPassword.value != newPasswordRepeat.value) {
        newPasswordRepeat.focus();
        alert("Passwords must match");
        return;
    }

    return {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value
    }
}



function validPassword(password) {
    var regex = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    if (!regex.test(password)) return false;
    else return true;
}

function clearPasswordFields() {
    document.getElementById("oldpassword").value = "";
    document.getElementById("newpassword").value = "";
    document.getElementById("newpasswordrepeat").value = "";
}

function get(url, handler) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var jsonData = JSON.parse(this.responseText);
            handler(jsonData);
        }
    };
    xhr.open("GET", url, true);
    xhr.send(null);
}

function put(url, details) {
    var params = Object.keys(details).map(
        function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(details[key])
        }
    ).join('&');

    var xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.onreadystatechange = function () {
        if (this.readyState == this.DONE && this.status == 200) {
            alert("Password Successfully Updated")
        } else if (this.readyState == this.DONE && (this.status == 400 || this.status == 401)) {
            alert(this.responseText);
        }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
    return xhr;
}

function del(url, details, handler) {
    var params = Object.keys(details).map(
        function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(details[key])
        }
    ).join('&');
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', url);
    xhr.onreadystatechange = function () {
        if (this.readyState == this.DONE && this.status == 200) {
            handler();
        } else if (this.readyState == this.DONE && (this.status == 400 || this.status == 401)) {
            alert(this.responseText);
        }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
    return xhr;
}

function updateUserData(data) {
    var name = document.getElementById("namediv");
    name.innerHTML = name.innerHTML + data.forename + " " + data.lastname;

    var email = document.getElementById("emaildiv");
    email.innerHTML = email.innerHTML + data.email;

}

function updateUserImgs(data){
    var template = document.getElementById("cardTemplate");
    var cardContent = template.content.getElementById("cardContent");
    var cardSpace = document.getElementById("cardSpace");
    cardSpace.innerHTML ="";
    data.forEach(function(card){
        var a = document.importNode(cardContent, true);
        a.querySelector("#cardImage").src = baseURL + card.filename;
        a.querySelector("#name").textContent += card.name;
        a.querySelector("#score").textContent += card.score;
        a.querySelector("#imgID").textContent += card.img_id;
        a.querySelector("#downloadLink").href = baseURL + card.filename;
        a.querySelector("#downloadLink").download = card.name;
        a.querySelector("#delete").addEventListener('click', deleteClick);
        cardSpace.appendChild(a);
    });
}