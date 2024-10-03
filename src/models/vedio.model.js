import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const VedioSchema = new Schema({
    vedioFile:{
        type:String,//cloudnary url
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    view:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    Owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }

},{timestamps:true})

VedioSchema.plugin(mongooseAggregatePaginate)

export const Vedio = mongoose.model('Vedio',VedioSchema)