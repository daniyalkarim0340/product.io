const MiddlewareError=(err,req,res,next)=>{
        const message= err.message || "Internal Server Error"
        const statusCode=err.statusCode || 500
        res.status(statusCode).json({
            message:message
        })
}


export default MiddlewareError