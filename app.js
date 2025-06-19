import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import router from './router.js';
import jwtVerfication from './common/common_function.js';
import * as cron from './common/cron.js'

dotenv.config()

const app = express();
const port = process.env.PORT || 5000;
const mongodb = process.env.MONGO_URL

mongoose.connect(mongodb)
.then(()=>{
    console.log("Database connected successfully");
})
.catch((err)=>{
    console.error("DataBase ERROR :", err.message)
})

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use('/api',jwtVerfication, router);

app.listen(port,(err)=>{
    if(err) throw err;
    console.log("Server running port is ",port)
})