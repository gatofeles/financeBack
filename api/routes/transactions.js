const express = require('express');
const router = express.Router();
const Transaction = require("../models/transaction");
const mongoose = require("mongoose");
const auth =  require('../middleware/auth');

router.get('/', auth, async(req, res, next)=>{
    const response = await Transaction.getAllTrans();
    if(!response[0]){
        res.status(400).send(response[1]);
    }
    else{
        res.status(200).send(response[1]);
    }   
});

router.get('/:tranId', auth, async(req, res, next)=>{
    const response = await Transaction.getTranById(req.params.tranId);
    if(!response[0]){
        res.status(400).send(response[1]);
    }
    else{
        res.status(200).send(response[1]);
    }   
});

router.get('/:userId', auth,  async(req, res, next)=>{
    const response = await Transaction.getTransByUserId(req.params.userId);
    if(!response[0]){
        
        res.status(400).send(response[1]);
    }
    else if(response[1].length <= 0){
        res.status(404).send(response[1]);
    }
    else{
        res.status(200).send(response[1]);
    }
});

router.post('/',  auth, async(req, res, next)=>{
    const response = await Transaction.createTran(req.body);
    if(!response[0]){
        res.status(400).send(response[1]);
    }
    else{
        res.status(200).send(response[1]);
    }
});

router.put('/', auth, async(req, res,next)=>{
    const response = await Transaction.updateTran(req.body);
    if(!response[0]){
        res.status(400).send(response[1]);
    }
    else{
        res.status(200).send(response[1]);
    }
});

router.delete('/',  auth, async(req, res,next)=>{
    const response = await Transaction.deleteTran(req.body);
    if(!response[0]){
        res.status(400).send(response[1]);
    }
    else{
        res.status(200).send(response[1]);
    }
});


module.exports = router;