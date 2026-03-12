// controllers/auth.controller.js
import Asynchandler from "../handle/asynhandler.js";
import CustomError from "../handle/customerror.js";
import {User} from "../model/user.model.js";
import { GenerateAccessToken, GenerateRefreshToken } from "../utils/gernatetoken.js";
import CookiesOption from "../utils/cookies.js";
import jwt from "jsonwebtoken";

// -------------------- Register User --------------------
const RegisterUser = Asynchandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new CustomError(400, "Email is already registered"));
  }

  const user = await User.create({ name, email, password, role });

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// -------------------- Login User --------------------
const Loginuser = Asynchandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new CustomError(400, "Invalid email or password"));

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) return next(new CustomError(400, "Invalid email or password"));

  const accessToken = GenerateAccessToken(user);
  const refreshToken = GenerateRefreshToken(user);

  if (!user.refreshToken) user.refreshToken = [];
  user.refreshToken.push({ token: refreshToken, createdAt: new Date() });
  await user.save({ validateBeforeSave: false });

  res.cookie("refreshtoken", refreshToken, CookiesOption);

  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    token: accessToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// -------------------- Regenerate Access Token --------------------
const ReGernateAccessToken = Asynchandler(async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshtoken;
    if (!refreshToken) return next(new CustomError(401, "Refresh token missing"));

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return next(new CustomError(401, "Invalid or expired refresh token"));
    }

    const user = await User.findOne({ _id: decoded.userId, "refreshToken.token": refreshToken });
    if (!user) return next(new CustomError(401, "Unauthorized"));

    const accessToken = GenerateAccessToken(user);
    return res.status(200).json({
      success: true,
      token: accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("ReGernateAccessToken Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// -------------------- Logout User --------------------
const Logoutuser = Asynchandler(async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new CustomError(401, "User not found"));

  user.refreshToken = [];
  await user.save({ validateBeforeSave: false });

  res.clearCookie("refreshtoken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

// -------------------- Google OAuth --------------------
const GoogleAuth = Asynchandler(async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new CustomError(401, "User not found"));
    }
    const accessToken = GenerateAccessToken(user);
    const refreshToken = GenerateRefreshToken(user);

    if (!user.refreshToken) user.refreshToken = [];
    user.refreshToken.push({ token: refreshToken, createdAt: new Date() });
    await user.save({ validateBeforeSave: false });

    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 60 * 1000
    });

    res.redirect(`http://localhost:5173/auth?success=true&accessToken=${accessToken}`);
  } catch (error) {
    res.redirect(`http://localhost:5173/auth?error=${encodeURIComponent(error.message)}`);
  }
});

export { RegisterUser, Loginuser, ReGernateAccessToken, Logoutuser, GoogleAuth };

