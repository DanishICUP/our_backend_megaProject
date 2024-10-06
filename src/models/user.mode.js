import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,//cloudnary url
        required:true
    },
    coverImage:{
        type:String
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:'Vedio'
        }
    ],
    password:{
        type:String,
        required:[true,'password is required']
    },
    refreshToken:{
        type:String
    }

},{timestamps:true});

//middleware for hash password
UserSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next()

    this.password = bcrypt.hash(this.password,10)
    next()
})
// for password comparision password with hash
UserSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password)
}
//generate refresh token and access token using jwt
UserSchema.methods.genrateAccessToken = function(){
       return jwt.sign(
            {
                //payload and other with this ..... this will come database
                _id:this._id,
                email:this.email,
                username:this.username,
                fullname:this.fullname
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn:process.env.ACCESS_TOKEN_EXPIRE
            }
        )
}
UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            //payload and other ..... this will come database
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User',UserSchema);