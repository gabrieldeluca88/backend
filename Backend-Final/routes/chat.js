import { Router } from "express";
import authMW from "../middlewares/auth.js";
import { MensajesDao } from "../daos/DAOFactory.js";
import path from "path";

const chatRouter = Router();

//* Chat
chatRouter.get("/", authMW, (req, res) => {
    const email = req.user.username;
    res.render(path.join(process.cwd(), "/public/views/chat.ejs"), { email: email });
});

//* Filtrar según ID
chatRouter.get("/:email", authMW, async (req, res) => {
    try {
        const { email } = req.params;
        const find = await MensajesDao.getByUser(email);
        res.send(find);
    } catch (e) {
        res.status(404).json({ error: "Error al filtrar los mensajes del usuario" })
    }
});


export default chatRouter;