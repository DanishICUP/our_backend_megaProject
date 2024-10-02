// require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import connectDb from './db/index.js'

dotenv.config({
    path:'./env'
})



connectDb()












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