class ApiError extends Error {
    // creating constructors
    constructor(
        statuscode,
        message = "something went wrong",
        error = [],
        stack = ""
    ){
        super(message)
        this.statuscode = statuscode
        this.data = null,// Read for more
        this.message = message
        this.success = false;
        this.error = error

        if (stack) {
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}


export {ApiError}