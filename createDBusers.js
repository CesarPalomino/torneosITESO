const fs = require('fs');
let users = [{
    "nombre": "Juan",
    "apellidos": "Perez",
    "nick": "JuanPerezElCrack777",
    "email": "perez@gmail.com",
    "password": "hoola",
    "fecha": "2000-10-28",
    "uid": 10001,
    "image": "https://randomuser.me/api/portraits/men/4.jpg",
    "gamelist": [{
        "game": 101,
        "clas": 10
    },
        {
            "game": 102,
            "clas": 5
        },
        {
            "game": 103,
            "clas": 0
        }],
    "token": "7942wcsR7d-10001"
}];

let men=1;
let women=1;


for (let i = 0; i < 100; i++) {
    let id = i + 1
    let nick = Math.round(Math.random() * (10000 - 10) + 10);
    let pass = Math.round(Math.random() * (10000000000000000 - 1000000) + 1000000);
    let year = Math.round(Math.random() * (2002 - 1970) + 1970);
    let month = Math.round(Math.random() * (12 - 1) + 1);
    let day = Math.round(Math.random() * (28 - 1) + 1);
    let gender = (i % 2 > 0) ? 'H' : 'M';
    let image = '';

    if (gender === 'H') {
        image = `https://randomuser.me/api/portraits/men/${men}.jpg`;
        men++;
    } else {
        image = `https://randomuser.me/api/portraits/women/${women}.jpg`;
        women++;
    }
    let gamenum = Math.round(Math.random() * (3 - 1) + 1);

    let games = '[';

    for (let j = 0; j < gamenum; j++) {
        let game = 101 + Math.round(Math.random() * 5);
        let rank = Math.round(Math.random() * 10);
        games += '{"game":'+game+', "clas":'+rank+'}'
        if (j<gamenum-1){
            games+=','
        }
    }
    games += ']'
    let user = {
        "nombre": `nom-${id}`,
        "apellidos": `app-${id}`,
        "nick": `XxScrubKilla${nick}Xx`,
        "email": `placeholdemail${10002 + i}@gmail.com`,
        "password": pass,
        "fecha": `${year}-${month}-${day}`,
        "uid": 10002 + i,
        "image": image,
        "gamelist": JSON.parse(games),
        "token": "7942wcsR7d-10001"
    }
    users.push(user);
}
console.table(users);
fs.writeFileSync('./data/users.json', JSON.stringify(users));