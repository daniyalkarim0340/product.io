import { Router } from "express";
import { RegisterUser,Loginuser,ReGernateAccessToken, Logoutuser, GoogleAuth } from "../controllar/auth.controllar.js";
import Validate from "../middleware/validate.js";
import { registerSchema } from "../schema/userregister.zod.js";
import { loginSchema } from "../schema/userlogin.zod.js";
import AuthMiddleware from "../middleware/authmiddleware.js";
import passport from "passport";

const authroute= Router()

authroute.post("/register", Validate(registerSchema),RegisterUser)
authroute.post("/login",Validate(loginSchema),Loginuser)
authroute.post("/generateaccesstoken",ReGernateAccessToken)
authroute.get("/logout",AuthMiddleware,Logoutuser)

authroute.get("/google",passport.authenticate("google",{
    scope:["profile","email"]
}))
authroute.get("/google/callback",passport.authenticate("google",{
    failureRedirect:"http://localhost:5173/auth/failure",
    successRedirect:"http://localhost:5173/auth/sucess"
}),GoogleAuth)

export default authroute