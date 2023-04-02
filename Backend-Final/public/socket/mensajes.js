import { MensajesDao } from "../../daos/DAOFactory.js";

let messages = await MensajesDao.getAll();

const socketMensajes = (socket, sockets) => {
    //*EMISIÓN
    socket.emit("mensajes", messages);

    //*RECEPCIÓN
    socket.on("newMensaje", async (data) =>{
    const date = new Date().toLocaleString();
    await MensajesDao.save({
        timestamp: date,
        message: data.message,
        id_user: data.id_user,
        }
    );

    messages = await MensajesDao.getAll();

    //*Post emisión
    sockets.emit("mensajes", messages);
    })
}

export default socketMensajes;

