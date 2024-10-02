import mongoose from "mongoose";
import {DB_NAME} from '../constants.js'

const connectDb = async()=>{
    try {
        const connectionInstence = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Mongodb Connected !! DB HOST${connectionInstence.connection.host}`);
    } catch (error) {
        console.log('Error:',error);
        process.exit(1)     
    }
}

export default connectDb

