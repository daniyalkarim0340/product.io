import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const nodemailerconfig= nodemailer.createTransport({
    host:process.env.HOST,
    port:process.env.PORT_NO,
    secure:false,
    auth:{
        user:process.env.USER,
        pass:process.env.PASS
    }
})


export default nodemailerconfig
