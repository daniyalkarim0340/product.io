import { Router } from "express";
import { RegisterUser,Loginuser,ReGernateAccessToken, Logoutuser } from "../controllar/auth.controllar.js";
import Validate from "../middleware/validate.js";
import { registerSchema } from "../schema/userregister.zod.js";
import { loginSchema } from "../schema/userlogin.zod.js";
import AuthMiddleware from "../middleware/authmiddleware.js";

const authroute= Router()

authroute.post("/register", Validate(registerSchema),RegisterUser)
authroute.post("/login",Validate(loginSchema),Loginuser)
authroute.post("/generateaccesstoken",ReGernateAccessToken)
authroute.get("/logout",AuthMiddleware,Logoutuser)

export default authroute