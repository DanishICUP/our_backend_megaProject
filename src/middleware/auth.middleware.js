import { asyncHandler } from "../util/asyncHandler.js";
import { ApiError } from "../util/ApiError.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.mode.js"

export const verifyJWT = asyncHandler(async (req,_,next) => {
  try {
    const token =  req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ", "")
 
    if (!token) {
         throw new ApiError(400,"unAutorized Request");
    }
 
    const decodetoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodetoken?._id).select("-password -refreshToken")
 
    if (!user) {
       throw new ApiError(404,"Invalid Access Token")
    }
    req.user = user
    next()
  } catch (error) {
      throw new ApiError(500,"Error verifying JWT Token",error)
  }
})