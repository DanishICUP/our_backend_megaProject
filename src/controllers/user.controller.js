import { asyncHandler } from "../util/asyncHandler.js";

const registeruser = asyncHandler( async (req,res) => {
     res.status(200).json({
        message:'Danish with full stack backend'
    })
})

export {registeruser}