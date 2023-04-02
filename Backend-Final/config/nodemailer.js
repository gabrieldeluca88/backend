import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

export const transporter  = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
        }
    });
