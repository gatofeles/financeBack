const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//getting routers
const transactionsRouter = require('./routes/transactions');
const usersRouter = require('./routes/users');

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//connecting to database
mongoose.connect(process.env.FINANCE);

//handling CORS
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    if(req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
        return res.status(200).json({});
    }

    next();
});

//routes
app.use('/transactions', transactionsRouter);
app.use('/users', usersRouter);

//error handling
app.use((req, res, next)=>{
    const error = new Error('Endpoint not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;