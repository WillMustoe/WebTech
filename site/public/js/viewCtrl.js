"use strict"

addEventListener('load', start);

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

function updateCards(){
    var template = document.getElementById("cardTemplate");
    var cardContent = template.content.getElementById("cardContent");
    var cardSpace = document.getElementById("cardSpace");
    cards.forEach(function(card){
        var a = document.importNode(cardContent, true);
        a.querySelector("#cardImage").src = card.imgUrl;
        a.querySelector("#name").textContent += card.name;
        a.querySelector("#user").textContent += card.user;
        a.querySelector("#score").textContent += card.points;
        cardSpace.appendChild(a);
    });
}

function start(){
    updateCards();
}
