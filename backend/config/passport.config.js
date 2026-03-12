import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {User} from "../model/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:8080/api/v1/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        // 1. Check if user exists by Google ID or Email
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (user) {
          // Link Google ID if they previously registered with email
          if (!user.googleId) {
            user.googleId = profile.id;
            if (!user.provider) user.provider = "google";
            await user.save();
          }
          return done(null, user);
        } else {
          // 2. Create new user if they don't exist
          // IMPORTANT: Ensure your User Schema allows password to be null/optional
          const newUser = await User.create({
            googleId: profile.id,
            provider: "google",
            name: profile.displayName || profile.name?.givenName,
            email: email,
            gender: "other", // Match your enum if applicable
            avatar: profile.photos?.[0]?.value, // Optional: capture profile picture
          });

          return done(null, newUser);
        }
      } catch (error) {
        console.error("Passport Strategy Error:", error);
        return done(error, null);
      }
    }
  )
);

