import { UserEvent } from "../event/event.constant.js";
import eventBus from "../event/eventBus.js";
import Asynchandler from "../handle/asynhandler.js";
import CustomError from "../handle/customerror.js";
import { User } from "../model/user.model.js";
import CookiesOption from "../utils/cookies.js";
import { GenerateRefreshToken, GenerateAccessToken } from "../utils/gernatetoken.js";
import jwt from "jsonwebtoken";

// User Register Controller
const RegisterUser = Asynchandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email is already registered",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully and email sent to your email",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  eventBus.emit(UserEvent.REGISTER, user);
});

const Loginuser = Asynchandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new CustomError(400, "Invalid email or password"));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new CustomError(400, "Invalid email or password"));
  }

  const accessToken = GenerateAccessToken(user);
  const refreshToken = GenerateRefreshToken(user);

  user.refreshToken.push({
    token: refreshToken,
    createdAt: Date.now(),
  });

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

const ReGernateAccessToken = Asynchandler(async (req, res, next) => {
  const refreshToken = req.cookies.refreshtoken;
  if (!refreshToken) {
    return next(new CustomError(401, "Unauthorized"));
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(new CustomError(401, "Unauthorized"));
  }

  const accessToken = GenerateAccessToken(user);
  return res.status(200).json({
    success: true,
    message: "user login success fully",
    token: accessToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const Logoutuser = Asynchandler(async (req, res, next) => {
  const user = req.user;
  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });

  res.clearCookie("refreshtoken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    message: "User logout successfully",
  });
});

export { RegisterUser, Loginuser, ReGernateAccessToken, Logoutuser };
