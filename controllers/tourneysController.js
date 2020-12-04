const fs = require('fs');
const PATH = require('path');
const TOURNEY_DB = require('../data/tourneys.json');
const USERS_DB = require('../data/users.json');
let CURRENT_ID = 0;


let tids = TOURNEY_DB.map((obj)=>{return obj.tid});
CURRENT_ID = Math.max(...tids)+1;
console.log(`Current id: ${CURRENT_ID}`);
// console.table(TOURNEY_DB);

class TourneysController {
    generateId(){
        let id = CURRENT_ID;
        CURRENT_ID++;
        fs
        return id;
    }

    persist(){
        let path = PATH.join(__dirname,'..','data','tourneys.json');
        console.log(path);
        fs.writeFileSync(path,JSON.stringify(TOURNEY_DB));
    }

    insertTourney(tourney){
        tourney.tid = this.generateId();
        TOURNEY_DB.push(tourney);
        this.persist();
        return tourney;
    }

    updateTourney(tourney){
        let index = TOURNEY_DB.findIndex(element => element.tid === tourney.tid);
        if(index>-1){
            TOURNEY_DB[index] = Object.assign(TOURNEY_DB[index],tourney);
            this.persist();
            return tourney;
        }else{
            return undefined;
        }
    }

    deleteTourney(tourney){
        let index = TOURNEY_DB.findIndex(element => element.tid === tourney.tid);
        if(index>-1){
            TOURNEY_DB.splice(index,1);
            return true;
        }else{
            return false;
        }
    }

    getList(){
        return TOURNEY_DB;
    }

    getTourney(id){
        let tourney = TOURNEY_DB.find(ele=>ele.tid ===id);
        return {...tourney};
    }

    insertParticipant(user, tourney){
        let indexu = USERS_DB.findIndex(element => element.uid === user.uid);
        let indext = TOURNEY_DB.findIndex(element => element.tid === tourney.tid);
        if(indexu>-1 && indext>-1 ){
            tourney.gamelist.push({jugador: user.uid});
            tourney.cantjug = tourney.gamelist.length;
            TOURNEY_DB[indext] = Object.assign(TOURNEY_DB[indext],tourney);
            this.persist();
            return tourney;
        }else{
            return undefined;
        }     
    }

    deleteParticipant(user, tourney){
        let indexu = USERS_DB.findIndex(element => element.uid === user.uid);
        let indext = TOURNEY_DB.findIndex(element => element.tid === tourney.tid);
        if(indexu>-1 && indext>-1) { 
            tourney.gamelist = tourney.gamelist.filter(element => element.jugador !== user.uid);
            tourney.cantjug = tourney.gamelist.length;
            TOURNEY_DB[indext] = Object.assign(TOURNEY_DB[indext],tourney);
            this.persist();
            return true;
        }else{
            return false;
        }     
    }

    startState(tourney){
        let index = TOURNEY_DB.findIndex(element => element.tid === tourney.tid);
        if(index>-1){
            tourney.curso=true;
            TOURNEY_DB[index] = Object.assign(TOURNEY_DB[index],tourney);
            this.persist();
            return tourney;
        }else{
            return undefined;
        }
    }


}

module.exports = TourneysController;