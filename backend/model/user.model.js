import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return this.provider === "local";
      
    },
    minlength: 6
  },
  role: {
    type: String,
    enum: ["user", "admin", "business"], 
    default: "user"
  },
  refreshToken:[
    {
      token:{
        type:String,
        required:true
      },
      createdAt:{
        type:Date,
        default:Date.now
      }
    }
   
  ],
   provider:{
      type:String,
      default:"local",
      enum:["local","google","facebook"]
    },
   googleId: {
    type: String,
    default: null
  }
 
  
 
},{timestamps:true});


userSchema.pre("save", async function() {
  if (!this.isModified("password") || this.provider!=="local") {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
