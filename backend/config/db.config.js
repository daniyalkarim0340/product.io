import mongoose from "mongoose";

const Dbconfig= async(req,res,next)=>{
   try {
    const databaseconnection= await  mongoose.connect(process.env.DB_CONNECTION)
    
   } catch (error) {
    console.log("something get wrong",error);
    
   }
}



export default Dbconfig
