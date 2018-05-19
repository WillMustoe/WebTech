"use strict"

addEventListener('load', start);
var baseURL = window.location.origin + '/';

var cards = [];

cards.push(
    {
    user: "John",
    name: "lines",
    imgUrl: "https://picsum.photos/400/?random",
    points: 5
    }
);

cards.push(
    {
    user: "Steve",
    name: "More Line",
    imgUrl: "https://picsum.photos/300/?random",
    points: 12
    }
);

cards.push(
    {
    user: "Ellie",
    name: "Geometric",
    imgUrl: "https://picsum.photos/200/?random",
    points: 22
    }
);
cards.push(
    {
    user: "John",
    name: "lines",
    imgUrl: "https://picsum.photos/500/?random",
    points: 5
    }
);

cards.push(
    {
    user: "Steve",
    name: "More Line",
    imgUrl: "https://picsum.photos/220/?random",
    points: 12
    }
);

cards.push(
    {
    user: "Ellie",
    name: "Geometric",
    imgUrl: "https://picsum.photos/250/?random",
    points: 22
    }
);

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

function updateCards(cards){
    console.log(cards);
    var template = document.getElementById("cardTemplate");
    var cardContent = template.content.getElementById("cardContent");
    var cardSpace = document.getElementById("cardSpace");
    cardSpace.innerHTML ="";
    cards.forEach(function(card){
        var a = document.importNode(cardContent, true);
        a.querySelector("#cardImage").src = baseURL + card.filename;
        a.querySelector("#name").textContent += card.name;
        //a.querySelector("#user").textContent += card.user;
        a.querySelector("#score").textContent += card.score;
        cardSpace.appendChild(a);
    });
}

function start(){
    get(baseURL + 'img', updateCards);
}
