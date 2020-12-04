const fs = require('fs');
const PATH = require('path');
const GAMES_DB = require('../data/games.json');
let CURRENT_ID = 0;


let gids = GAMES_DB.map((obj)=>{return obj.gid});
CURRENT_ID = Math.max(...gids)+1;
console.log(`Current id: ${CURRENT_ID}`);
// console.table(GAMES_DB);

class GamesController {
    generateId(){
        let id = CURRENT_ID;
        CURRENT_ID++;
        fs
        return id;
    }
    /*updateUser(game){
        let index = GAMES_DB.findIndex(element => element.uid === game.uid);
        if(index>-1){
            GAMES_DB[index] = Object.assign(GAMES_DB[index],game);
            return game;
        }else{
            return undefined;
        }
    }*/
    
    getList(){
        return GAMES_DB;
    }

    getGame(id){
        let game = GAMES_DB.find(ele=>ele.gid ===id);
        return game;
    }

    getGamerByName(name){
        let game = GAMES_DB.find(ele=>ele.name ===name);
        return game;
    }
}

module.exports = GamesController;