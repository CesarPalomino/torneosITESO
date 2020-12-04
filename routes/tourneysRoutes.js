'use strict';
const express = require('express');
const parse = require('date-fns/parse');
const isBefore = require('date-fns/isBefore')
const gamesController = require('../controllers/gamesController');
const tourneysController = require('../controllers/tourneysController');
const usersController = require('../controllers/usersController');
const router = express();

router.get('/', (req, res) => {
    let tourneyCtrl = new tourneysController();
    let tourneys = tourneyCtrl.getList();
    let gamesCtrl = new gamesController();
    let limit = (req.query.limit) ? parseInt(req.query.limit) : 5;
    let page = 1;
    if (req.query.name) {
        let nom = (req.query.name) ? req.query.name : '';
        tourneys = tourneys.filter((ele, index, arr) => {
            return ele.nombre.toUpperCase().includes(nom.toUpperCase());
        });
    }
    let population = tourneys.length;
    let totalPages = Math.round(population / limit);
    if (req.query.page) {
        page = parseInt(req.query.page) * limit - limit;
        tourneys = tourneys.slice(page, page + limit);
    } else {
        tourneys = tourneys.slice(0, 0 + 5);
    }
    if (req.query.date) {
        tourneys = tourneys.filter(ele => new Date(ele.fecha).getTime() === new Date(req.query.date).getTime());
    }

    tourneys = tourneys.map((val, index, arra) => {
        return {
            ...val,
            juego: gamesCtrl.getGame(val.juego).nombre

        }
    });
    res.send({content: tourneys, page: page, totalPages: totalPages});

});

router.post('/', (req, res) => {
    let tourneysCtrl = new tourneysController();

    let newTourney = {
       ...req.body,
       admin: req.uid,
       gamelist: [],
       cantjug: 0
    }

    res.status(201).send(tourneysCtrl.insertTourney(newTourney));
});

router.get('/carousel',(req,res)=>{
    let orderBy = req.query.order || 'highlighted';
    let limit = (req.query.limit) ? parseInt(req.query.limit) : 5;
    let page = (req.query.page) ? parseInt(req.query.page) : 0;

    let tourneysCtrl = new tourneysController();
    let gamesCtrl = new gamesController();

    let tourneys = tourneysCtrl.getList();

    if (tourneys === null || tourneys === undefined) {
        res.set('Content-Type','application/json');
        res.status(404).send({});
        return;
    }

    switch (orderBy) {
        case 'new' :
            tourneys = tourneys.sort((a,b) => parse(b.fechai, 'yyyy-M-d', new Date()) - parse(a.fechai, 'yyyy-M-d', new Date()));
            break;
        case 'old' :
            tourneys = tourneys.sort((a,b) => parse(a.fechai, 'yyyy-M-d', new Date()) - parse(b.fechai, 'yyyy-M-d', new Date()));
            break;
        case 'next' :
            tourneys = tourneys.filter((a) => !isBefore(parse(a.fechai, 'yyyy-M-d', new Date()), new Date()));
            tourneys = tourneys.sort((a,b) => parse(a.fechai, 'yyyy-M-d', new Date()) - parse(b.fechai, 'yyyy-M-d', new Date()));
            break;
        default :
            tourneys = tourneys.sort((a,b) => a.cantjug > b.cantjug);
            break;
    }

    let population = tourneys.length;
    let totalPages = Math.round(population/limit);

    if (req.query.page) {
        const pageDeliver = page * limit - limit;
        tourneys = tourneys.slice(pageDeliver, pageDeliver + limit);
    } else {
        tourneys = tourneys.slice(0, 0 + limit);
    }

    tourneys = tourneys.map((tourney, index) => {
        return {
            ...tourney,
            pos: index,
            juego: gamesCtrl.getGame(tourney.juego) !== undefined ? gamesCtrl.getGame(tourney.juego).nombre : 'Game Not Found'
        }
    })

    res.send({content: tourneys, page: page, totalPages: totalPages});
    return;
});

router.get('/:tid', (req, res) => {
    let tourneyCtrl = new tourneysController();
    let gamesCtrl = new gamesController();
    let usersCtrl = new usersController();

    let tourney = tourneyCtrl.getTourney(parseInt(req.params.tid));

    if (tourney) {
        tourney.juego = gamesCtrl.getGame(tourney.juego) !== undefined ? gamesCtrl.getGame(tourney.juego).nombre : 'Game Not Found';
        tourney.gamelist = tourney.gamelist.map( user => {
            return usersCtrl.getUser(user.jugador);
        })
        res.send(tourney);
    }else{
        res.set('Content-Type','application/json');
        res.status(204).send({});
    }
});

router.put('/:tid', (req, res) => {
    let tourneyCtrl = new tourneysController();
    let tourney = tourneyCtrl.getTourney(parseInt(req.params.tid));

    if (tourney.admin !== req.uid) {
        res.set('Content-Type','application/json');
        res.status(403).send({message: 'Not Admin'});
        return;
    }

    if (tourney) {
        tourney = {
            ...tourney,
            ...req.body
        }

        tourneyCtrl.updateTourney(tourney);

        res.send(tourney);
    }else{
        res.set('Content-Type','application/json');
        res.status(204).send({});
    }
});

router.delete('/:tid', (req, res) => {
    let tourneyCtrl = new tourneysController();
    let tourney = tourneyCtrl.getTourney(parseInt(req.params.tid));
    if (tourney) {
        tourneyCtrl.deleteTourney(tourney);
        res.send({});
    }else{
        res.set('Content-Type','application/json');
        res.status(204).send({});
    }
});

router.put('/:tid/participant/:uid', (req, res) => {
    let tourneyCtrl = new tourneysController();
    let usersCtrl = new usersController();

    let tourney = tourneyCtrl.getTourney(parseInt(req.params.tid));
    let user = usersCtrl.getUser(parseInt(req.params.uid));

    if (tourney && user) {
    
        tourneyCtrl.insertParticipant(user, tourney);
        tourney = tourneyCtrl.getTourney(parseInt(req.params.tid));

        res.send(tourney);
    }else{
        res.set('Content-Type','application/json');
        res.status(204).send({});
    }
});

router.delete('/:tid/participant/:uid', (req, res) => {
    let tourneyCtrl = new tourneysController();
    let usersCtrl = new usersController();

    let tourney = tourneyCtrl.getTourney(parseInt(req.params.tid));
    let user = usersCtrl.getUser(parseInt(req.params.uid));

    if (tourney && user) {
        tourneyCtrl.deleteParticipant(user, tourney);
        tourney = tourneyCtrl.getTourney(parseInt(req.params.tid));

        res.send(tourney);
    }else{
        res.set('Content-Type','application/json');
        res.status(204).send({});
    }
});

module.exports = router;