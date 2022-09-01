const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Auth = require("../models/auth");

router.get('/', async(req, res, next)=>{
    const response = await User.showUsers();
    console.log(response);
    if(!response[0]){
        res.status(400).send(response[1]);
    }
    else{
        res.status(200).send(response[1]);
    }   

});

router.post('/login', async(req, res, next)=>{
    const response = await Auth.registerAuth(req.body);
    if(!response[0]){
        
        res.status(400).send(response[1]);
    }
    else{
        res.status(200).send(response[1]);
    }

});

router.post('/', async(req, res, next)=>{
    const response = await User.createUser(req.body);
    if(!response[0]){   
        res.status(400).send(response[1]);
    }
    else{
        res.status(200).send(response[1]);
    }

});

router.get('/:userId', (req, res, next)=>{


});

router.delete('/', async(req, res, next)=>{
    const response = await User.deleteUser(req.body);
    console.log(response);
    if(!response[0]){
        res.status(400).send(response[1]);
    }
    else{
        res.status(200).send(response[1]);
    }   

});

module.exports = router;