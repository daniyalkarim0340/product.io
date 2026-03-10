import nodemailerconfig from "../config/nodemailer.config.js";

const sendemail=async(useremail,subject,html)=>{
    try {
        await nodemailerconfig.sendMail({
            from: process.env.USER,
            to:useremail,
            subject:subject,
            html:html
        })
    } catch (error) {
        console.log(error);
        
    }
}


export default sendemail
