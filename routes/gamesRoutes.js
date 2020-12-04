'use strict';
const express = require('express');
const GamesController = require('../controllers/gamesController');
const gamesCtrl = new GamesController();
const router = express();

router.get('/',(req,res)=>{
    let games = gamesCtrl.getList();
    res.status(200).send(games);
});

module.exports = router;

/*router.get('/:email',(req,res)=>{
    let gameCtrl = new GamesController();
    let users = gameCtrl.getList();
    if(req.params.email){
        users = users.find(ele=> ele.email === req.params.email);
        if(users){
            res.send(users);
        }else{
            res.set('Content-Type','application/json');
            res.status(204).send({});
        }
    }else{
        res.status(400).send('missing params');
    }
});*/