import { asyncHandler } from "../util/asyncHandler.js";
import { ApiError } from '../util/ApiError.js'
import { User } from '../models/user.mode.js'
import { UploadOnClodinary } from '../util/cloudinary.js'
import { ApiRespone } from '../util/ApiRespone.js'
import jwt from 'jsonwebtoken'

//generate tokens for user autentications
const generateRefreshAndAccessTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const AccessToken = user.genrateAccessToken()
        const RefreshToken = user.generateRefreshToken()

        //save refresh token in db 
        user.RefreshToken = RefreshToken
        user.save({ validateBeforeSave: false })

        return { AccessToken, RefreshToken }
    } catch (error) {
        throw new ApiError(500, "Error While generating refreash and access tokens", error);
    }
}


const registeruser = asyncHandler(async (req, res) => {

    //get data from user 
    const { username, email, fullname, password } = req.body;
    // console.log("email:",email);

    //validation
    // if (fullname === '') {
    //     throw new ApiError(400,'FullName is required')
    // }
    //next level method for validation
    if (
        [username, email, fullname, password].some((field) => field?.trim() === '')
    ) {
        throw new ApiError(400, 'App fields are required')
    }
    //user checking if this is already avaliable
    //simple method
    // User.findOne({username},{email})
    //advance way
    const userExist = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (userExist) {
        throw new ApiError(409, 'user with username and email already exist !!')
    }

    //for avatar and cover images
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    //we are already check avatar image and second check cover Image using classic way
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }


    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar Image is Required!!')
    }

    //upload on cloudinary
    const avatar = await UploadOnClodinary(avatarLocalPath)
    const coverImage = await UploadOnClodinary(coverImageLocalPath)
    if (!avatar) {
        throw new ApiError(400, 'Uploading Failed ...')
    }

    //data enter into database
    const user = await User.create({
        fullname,
        avatar: avatar?.url || "",
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    //checking and remove any field
    const createUser = await User.findById(user._id).select(
        '-password -refreshToken'
    )
    if (!createUser) {
        throw new ApiError(400, "error when registering the user");
    }

    //sent response
    return res.status(201).json(
        new ApiRespone(200, createUser, 'user register Successfully...')
    )
})

const LoginUser = asyncHandler(async (req, res) => {
    //get data from body
    const { email, password, username } = req.body;

    //check its available
    if (!(email || username)) {
        throw new ApiError(400, "Email and username is required")
    }

    //find in database
    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!user) {
        throw new ApiError(404, "username and email does not exist !")
    }

    //check password
    const ispasswordValid = await user.isPasswordCorrect(password);
    if (!ispasswordValid) {
        throw new ApiError(401, "invalid password credientials")
    }

    const { AccessToken, RefreshToken } = await generateRefreshAndAccessTokens(user._id);

    const loggedUser = await User.findById(user._id).select("-password -refreshToken")

    //last step sent cookie 
    const option = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("AccessToken", AccessToken, option)
        .cookie("RefreshToken", RefreshToken, option)
        .json
        (
            new ApiRespone
                (
                    200,
                    {
                        user: loggedUser, RefreshToken, AccessToken
                    },
                    "User LoggedIn Successfully"
                ))
})

const LogOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            },
        },
        {
            new: true
        }
    )
    const option = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("AccessToken", option)
        .clearCookie("RefreshToken", option)
        .json(new ApiRespone(200, {}, "User LogOut Successfully"))

})

const RefreashTokenAccess = asyncHandler(async (req, res) => {
    //access token throw req.cookies
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unautorized request")
    }

    try {
        const decodeRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodeRefreshToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid user Token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is expired and already used")
        }

        const option = {
            httpOnly: true,
            secure: true
        }

        const { AccessToken, RefreshToken } = await generateRefreshAndAccessTokens(user?._id)

        //send cookies
        return res
            .status(200)
            .cookie("AccessToken", AccessToken, option)
            .cookie("RefreshToken", RefreshToken, option)
            .json(
                new ApiRespone(
                    200,
                    { AccessToken, RefreshToken },
                    "Access token is Refreshed Successfully "
                )
            )
    } catch (error) {
        throw new ApiError(404, "Error While Token Refreshing ", error)
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldpassword, newpassword, confirmpassword } = req.body;

    const user = await User.findById(req.user?._id);
    const ispasswordCorrect = user.ispasswordCorrect(oldpassword);

    if (newpassword !== confirmpassword) {
        throw new ApiError(404, "Invalid Password try again")
    }

    if (!ispasswordCorrect) {
        throw new ApiError(404, "invalid password")
    }
    user.password = newpassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiRespone(200, {}, "Password change successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(200, req.user, "user fetched successfully")
})

const updateUser = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body;

    if (!fullname || !email) {
        throw new ApiError(404, "Please all fields are required to update")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{fullname,email:email}
        },
        {
            new: true
        }

    ).select('-password')

    return res.status(200).json(new ApiRespone(200,user,"Account details updated successfully") )
})

const changeAvatar = asyncHandler(async(req,res)=>{
    const avatarlocalpath = req.file?.path

    if (!avatarlocalpath) {
        throw new ApiError(400,"Avatar image is missing")
    }
    const avatar = await UploadOnClodinary(avatarlocalpath)

    if (!avatar.url) {
        throw new ApiError(400,"Error While uploading on cloudinary")
    }
    //update avatar using set

    const user = await User.findByIdAndUpdate(
        {
            $set:{
                avatar:avatar.url
            }
        },
        {new:true}
    ).select('-password')


    return res
    .status(200)
    .json(new ApiRespone(200,user,"user avatar is updated successfully"))
})

const changeCoverImage = asyncHandler(async(req,res)=>{
    const coverImagelocalpath = req.file?.path

    if (!coverImagelocalpath) {
        throw new ApiError(400,"Avatar image is missing")
    }
    const coverImage = await UploadOnClodinary(coverImagelocalpath)

    if (!coverImage.url) {
        throw new ApiError(400,"Error While uploading on cloudinary")
    }
    //update avatar using set

    const user = await User.findByIdAndUpdate(
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {new:true}
    ).select('-password')

    return res
    .status(200)
    .json(new ApiRespone(200,user,"user avatar is updated successfully"))
})



export {
    registeruser,
    LoginUser,
    LogOutUser,
    RefreashTokenAccess,
    changeCurrentPassword,
    getCurrentUser,
    updateUser,
    changeAvatar,
    changeCoverImage 
}