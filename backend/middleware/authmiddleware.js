import Asynchandler from "../handle/asynhandler.js"
import { User } from "../model/user.model.js"
import jwt from "jsonwebtoken";
import CustomError from "../handle/customerror.js";


const AuthMiddleware=Asynchandler (async(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1]
    if (!token) {
        return next (new CustomError(401,"Unauthorized"))
    }
    const decoded= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
   if (!decoded) {
    return next (new CustomError(401,"Unauthorized"))
   }
   const user= await User.findById(decoded.userId)
   if (!user) {
    return next (new CustomError(401,"Unauthorized"))
   }
   req.user=user
   next()


})

export default AuthMiddleware
