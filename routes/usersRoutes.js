'use strict';
const express = require('express');
const UsersController = require('../controllers/usersController');
const usersCtrl = new UsersController();
const router = express();

router.post('/', (req, res) => {
    let b = req.body;
    if (b.nombre && b.apellidos && b.email && b.nick && b.fecha) {
        let u = usersCtrl.getUniqueUser(b.nombre, b.apellidos, b.email);
        if (u) {
            res.status(400).send('user already exists');
        } else {
            res.status(201).send(usersCtrl.insertUser(b));
        }
    } else {
        res.status(400).send('missing arguments');
    }
});

router.get('/:uid',(req,res)=>{
    let userCtrl = new UsersController();
    let user
    if(req.params.uid){
        user = userCtrl.getUser(parseInt(req.params.uid));
        if(user){
            res.send(user);
        }else{
            res.set('Content-Type','application/json');
            res.status(204).send({});
        }
    }else{
        res.status(400).send('missing params');
    }
});

router.put('/:id',(req,res)=>{
    let b = req.body;
    console.log(req.params.id)
    console.log(req.body);
    if (req.params.id && (b.nombre || b.apellidos || b.password || b.image)) {
        console.log("si entra")
        let u = usersCtrl.getUser(parseInt(req.params.id));
        if (u) {
            req.params.id = u.uid;
            Object.assign(u,b);
            res.status(200).send(usersCtrl.updateUser(u));
        } else {
            res.status(404).send('user does not exist');
        }
    } else {
        res.status(400).send('missing arguments');
    }
});

router.delete('/:email',(req,res)=>{
    if (req.params.email) {
        let u = usersCtrl.getUserByEmail(req.params.email);
        if (u) {
            res.status(200).send({"deleted": usersCtrl.deleteUser(u) });
        } else {
            res.status(404).send('user does not exist');
        }
    } else {
        res.status(400).send('missing arguments');
    }
});
module.exports = router;

/*router.get('/:email',(req,res)=>{
    let userCtrl = new UsersController();
    let users = userCtrl.getList();
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