import express from "express"
import dotenv from "dotenv"
import authroute from "./route/auth.route.js"
import cors from "cors"
import rateLimit from 'express-rate-limit';
import cookieParser from "cookie-parser";
import MiddlewareError from "./middleware/middleware.error.js";
import Userroute from "./route/user.route.js";
import Productroute from "./route/product.route.js";

dotenv.config()
const app = express()


const alloworigin = ["http://localhost:5173"]
const readorigin = ['*']
const cors0ption = (req, call) => {
    const origin = req.header("origin")
    if (!origin) {
        return call(null, {

            
            origin: true
        })
    }
    if (alloworigin.includes(origin)) {
        return call(null, {
            origin: true,
            methods: ["GET", 'PUT', 'DELETE', 'POST'],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true
        })
    }
    if (readorigin.includes(origin)) {
        return call(null, {
            origin: true,
            methods: ["GET"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true
        })
    }
}
const Ratelimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    legacyHeaders: false,
    standardHeaders: true,
    handler: (req, res) => {
        res.status(200).json({
            message: "Too many requests, please try again later.", ip: req.ip
        })
    }
})
app.use(cors(cors0ption))
app.use(Ratelimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1", Userroute)
app.use("/api/v1", authroute)
app.use("/api/v1", Productroute)



app.use(MiddlewareError)
export default app
