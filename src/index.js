// require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import connectDb from './db/index.js'
import { app } from './app.js'

dotenv.config({
    path:'./env'
})



connectDb()
//when connected thay will return promise for this we use .then and .catch
.then(()=>{
    app.listen(process.env.PORT || 4000,()=>{
        console.log('App running at ',process.env.PORT);
    })
})
.catch((err)=>{
    console.error("MONGODB CONNECTION ERROR !!!",err)
})












/*;(async()=>{
    import express from 'express';
const app = express()
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on('error',(error)=>{
            console.error(error);
            throw error;
        });

        app.listen(process.env.PORT,()=>{
            console.log(`${process.env.PORT}`);         
        })
    } catch (error) {
        console.error("ERROR: ",error);
        throw error
    }
})()*/