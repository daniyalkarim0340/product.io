class CustomError extends Error{
    constructor(statuscode,message){
        super(message)
        this.statusCode = statuscode
    }
}

export default CustomError
