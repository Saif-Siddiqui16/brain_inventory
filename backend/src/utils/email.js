import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS
    }
});

