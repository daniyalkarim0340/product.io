import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authroute from "./route/auth.route.js";
import Userroute from "./route/user.route.js";
import Productroute from "./route/product.route.js";
import passport from "passport";

import MiddlewareError from "./middleware/middleware.error.js";
import Dbconfig from "./config/db.config.js";

dotenv.config();

// ------------------ DATABASE CONNECTION ------------------
Dbconfig();

const app = express();

// ------------------ TRUST PROXY ------------------
// Required for handling redirects and secure cookies correctly
app.set("trust proxy", 1);

// ------------------ DEBUGGING ------------------
app.use(morgan("dev")); 

// ------------------ CORS CONFIG ------------------
const alloworigin = ["http://localhost:5173", "http://localhost:5174"];

const corsOption = (req, callback) => {
  const origin = req.header("origin");

  // Allow requests with no origin (like top-level redirects)
  if (!origin) {
    return callback(null, { origin: true });
  }

  if (alloworigin.includes(origin)) {
    return callback(null, {
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
      credentials: true, 
    });
  }

  return callback(new Error("Not allowed by CORS"));
};

// ------------------ SECURITY & REFERRER HEADERS ------------------
app.use((req, res, next) => {
  // Fixes the "strict-origin-when-cross-origin" error in the browser
  res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
  // Ensures the browser allows cookies to be passed back and forth
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// ------------------ RATE LIMIT ------------------
const Ratelimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 100,
  legacyHeaders: false,
  standardHeaders: true,
  handler: (req, res) => {
    res.status(429).json({
      message: "Too many requests, please try again later.",
      ip: req.ip,
    });
  },
});

// ------------------ MIDDLEWARE ------------------
app.use(cors(corsOption));
app.use(Ratelimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ------------------ PASSPORT ------------------
import "./config/passport.config.js";
app.use(passport.initialize());

// ------------------ ROUTES ------------------
app.use("/api/v1", authroute);
app.use("/api/v1", Userroute);
app.use("/api/v1", Productroute);

// ------------------ ERROR HANDLER ------------------
app.use(MiddlewareError);

export default app;