//two methods 


//second 
const asyncHandler = (requestHandler) => {
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}

export {asyncHandler}


//first
/*const asynHandler = (fn)=> async(req,res,next) => {
    try {
        await fn(req,res,next)
    } catch (error) {
        req.status(error.code || 500).json({
            success:false,
            message:err.message || message('MongoDb Error !!!')
        })
    }
}*/