import mongoose,{Schema} from "mongoose";

const subscribeSchama = new Schema({
    subscribe:{
        type:Schema.Types.ObjectId,//one who is subscribing
        ref:'User'
    },
    channel:{
        type:Schema.Types.ObjectId,//one who is subscriber to subscribing
        ref:'User'
    }
},{timestamps:true}) 


const Subscribe = mongoose.model('Subscribe',subscribeSchama)