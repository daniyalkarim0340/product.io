import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js"

console.log(process.env.GOOGLE_CALLBACK_URL , "CALLLLLLL")
// use passport  , __ 
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:8080/api/v1/google/callback",
    scope: ["profile", "email"]
}, async (_, __, profile, done) => {
    try {

        // check user already exist or not 
        const user = await User.findOne({
            $or: [{ googleId: profile.id }, { email: profile.emails[0].value }]
        })

       if(user){
          if(!user.googleId){
            user.googleId = profile.id,
            user.provider ="google"
            await user.save()
        }
        return done(null,  user)

       }else{
          const user  =  await User.create({
            googleId:profile.id,
            provider:"google",
            firstName:profile.name.givenName,
            gender:"other",
            email:profile.emails[0].value,
          })

          return done(null , user)

       }

    } catch (error) {

        return done(error , null)

    }
}))



export {passport};