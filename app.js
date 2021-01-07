//Imports all module here
const express = require('express');
require('dotenv').config();;
const mongoose = require('mongoose');

//Start Express
const app = express();

//Conncet To DB
mongoose.connect(process.env.DB_PATH, { useNewUrlParser: true , useUnifiedTopology: true} , ()=>{
console.log('connected to db');
});

//Import Route
const loginRoutes = require('./src/app/routes/auth/login');
const rgsRoutes = require('./src/app/routes/auth/registeration');

//Json-parser Middleware
app.use(express.urlencoded({'extended': true}));
app.use(express.json());

//Route Middlewares
app.use('/api/auth' , loginRoutes);
app.use('/api/auth' , rgsRoutes);

//Exports here
module.exports = app;