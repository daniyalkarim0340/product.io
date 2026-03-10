import jwt from "jsonwebtoken";

const GenerateAccessToken=(user)=>{
    return jwt.sign({userId:user._id},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"1d"
    })
}


const GenerateRefreshToken=(user)=>{
    return jwt.sign({userId:user._id},process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:"7d"
    })
}


export {GenerateAccessToken,GenerateRefreshToken}