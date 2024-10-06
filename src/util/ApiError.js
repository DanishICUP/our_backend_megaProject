class ApiError extends Error{
    constructor(
        statusCode,
        message='something went wrong',
        errors=[],
        stack=''
    ){
        //overrideng
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors =errors


        if(stack){
            this.stack = stack
        }else{
            this.errors=captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}