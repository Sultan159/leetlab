class ApiError extends Error {
    constructor(statusCode, message, error = [], stack = ""){
        super(message)
        this.statusCode = statusCode
        this.error = error
        this.message = message
        this.success = false

        if(stack){
            this.stack = stack
        } else {
            this.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }