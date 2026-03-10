import passport from "passport";
import {strategy as GoogleStrategy} from "passport-google-oauth20";
import { User } from "../model/user.model.js";



passport.use(new GoogleStrategy({
    clientID:"",
    clientSecret:"",
    callbackURL:"/auth/google/callback",
    scope:["profile","email"]

},
async (_,__,profile,done) => {
    try {
        const user= await User.findOne({email:profile.emails[0].value,profileId:profile.id})
        if (user) {
            return done(null,user)
        }
        if (!user) {
            user= await User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                profileId:profile.id
            })
            return done(null,user)
        }
    } catch (error) {
        return done(error,false)
    }
    
}

))

export default passport