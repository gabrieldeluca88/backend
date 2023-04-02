import { Router } from "express";
import * as dotenv from "dotenv";
dotenv.config();

const variablesEnv = Router();

variablesEnv.get("/", (req, res) => {
    try {
        const database = process.env.DATABASE;
        const type = process.env.TIPO;
        const nodemailerUser = process.env.SMTP_USER;
        const nodemailerPass = process.env.SMTP_PASS;
        const adminMail = process.env.ADMIN_MAIL;

    res.send({ 
        "Base de datos": database,
        "Persistencia": type,
        "Usuario Nodemailer": nodemailerUser,
        "Contraseña Nodemailer": nodemailerPass,
        "Mail de admin": adminMail 
    })
    } catch(e) {
        res.status(404).json({ error: `Error al mostrar las variables de entorno: ${e}` })
    }
    
});

export default variablesEnv;