import { asyncHandler } from "../util/asyncHandler.js";
import {ApiError} from '../util/ApiError.js'
import {User} from '../models/user.mode.js'
import {UploadOnClodinary} from '../util/cloudinary.js'
import {ApiRespone} from '../util/ApiRespone.js'

const registeruser = asyncHandler( async (req,res) => {

    //get data from user 
    const {username,email,fullname,password} = req.body;
    // console.log("email:",email);
    
    //validation
    // if (fullname === '') {
    //     throw new ApiError(400,'FullName is required')
    // }
    //next level method for validation
    if (
        [username,email,fullname,password].some((field) => field?.trim() === '')
    ) {
        throw new ApiError(400,'App fields are required')
    }
    //user checking if this is already avaliable
    //simple method
    // User.findOne({username},{email})
    //advance way
    const userExist = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (userExist) {
        throw new ApiError(409,'user with username and email already exist !!')
    }

    //for avatar and cover images
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400,'Avatar Image is Required!!')
    }

    //upload on cloudinary
    const avatar = await UploadOnClodinary(avatarLocalPath)
    const coverImage = await UploadOnClodinary(coverImageLocalPath)
    if (!avatar) {
        throw new ApiError(400,'Uploading Failed ...')
    }

    //data enter into database
    const user = await User.create({
        fullname,
        avatar:avatar?.url || "",
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
    //checking and remove any field
    const createUser = await User.findById(user._id).select(
        '-password -refreshToken'
    )
    if (!createUser) {
        throw new ApiError(400,"error when registering the user");
    }

    //sent response
    return res.status(201).json(
        new ApiRespone(200,createUser,'user register Successfully...')
    )
})

export {registeruser}