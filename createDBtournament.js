const fs = require('fs');
let torneo = [{
    "nombre": "The Big House 5",
    "juego": "Super Smash Bros. Melee",
    "fechai": "2020-12-4",
    "fechaf": "2020-12-6",
    "hora": "19:00",
    "limit": 2000,
    "cost": 30,
    "place": "Some street",
    "plat": "https://image.flaticon.com/icons/png/512/871/871377.png",
    "image": "https://randomuser.me/api/portraits/men/0.jpg"
}];

for (let i = 0; i < 100; i++) {
    let nombre = i + 1;
    let hora = Math.round(Math.random() * 24);
    let minuto = Math.round(Math.random() * 59);
    let day = Math.round(Math.random() * (28 - 1) + 1);
    let month = Math.round(Math.random() * (12 - 1) + 1);
    let limit = Math.round(Math.random() * (1000 - 10) + 10);
    let cost = Math.round(Math.random() * (100 - 10) + 10);



    let user = {
        "nombre": `Torneo #${nombre}`,
        "juego": `Super Smash Bros. Melee`,
        "fechai": `2020-${month}-${day}`,
        "fechaf": `2020-${month}-${day+2}`,
        "hora": `${hora}:${minuto}`,
        "limit": limit,
        "cost": cost,
        "place": "Some street",
        "plat": "https://image.flaticon.com/icons/png/512/871/871377.png",
        "image": "https://static.thenounproject.com/png/1760231-200.png"
    }
    torneo.push(user);
}
console.table(torneo);
fs.writeFileSync('./data/torneo.json', JSON.stringify(torneo));