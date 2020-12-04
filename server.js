'use strict';
const fs = require('fs');
const express = require('express');
const app = express();
const randomize = require('randomatic');
const cors = require('cors');

//load middleware
app.use(express.static(__dirname +'/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

const usersRouter = require('./routes/usersRoutes');
const gamesRouter = require('./routes/gamesRoutes');
const tourneysRouter = require('./routes/tourneysRoutes');

const UsersController = require('./controllers/usersController');

const PORT = process.env.PORT || 3000;

function authentication(req,res,next){
    let xauth = req.get('x-auth-user');
    if(xauth){
        let id = xauth.split("-").pop();
        let userctrl = new UsersController();
        let user = userctrl.getUser(parseInt(id));
        if(user && user.token === xauth){
            req.uid = user.uid;
            next();
        }else{
            res.status(401).send('Not authorized');
        }
    }else{
        res.status(401).send('Not authorized');
    }
    
}

app.use('/api/users',authentication, usersRouter);
app.use('/api/games', gamesRouter);
app.use('/api/tourneys', tourneysRouter);

app.post('/api/login',(req,res)=>{
    if(req.body.email && req.body.password){
        console.log(req.body);
        let uctrl = new UsersController();
        let user = uctrl.getUserByCredentials(req.body.email,req.body.password);
        if(user){
            let token = randomize('Aa0','10')+"-"+user.uid;
            user.token = token;
            uctrl.updateUser(user);
            res.status(200).send({"token":token});
        }else{
            res.status(401).send('Wrong credentials');
        }
    }else{
        res.status(400).send('Missing user/pass');
    }
});


app.post('/api/register', (req, res) => {
    let b = req.body;
    if (b.email && b.nick) {
        let usersCtrl = new UsersController();
        let u = usersCtrl.getUniqueUser(b.nick, b.email);
        if (u) {
            res.status(400).send('user already exists');
        } else {
            res.status(201).send(usersCtrl.insertUser(b));
        }
    } else {
        res.status(400).send('missing arguments');
    }
});

app.get('/',(req,res)=>{
    res.redirect("/html/index.html");
});


app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
})

let token = "Nmt3yIyNeV-10001"
let tokSep = token.split("-");
let uid = tokSep[tokSep.length-1];