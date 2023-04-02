import { Server as HttpServer } from "http";
import { DBConnect } from "./config/configMongo.js";
import ParseArgs from "minimist";
import cluster from "cluster";
import { cpus } from "os";
import app from "./app.js";
import logger from "./config/log4JS.js";
import { Server as Socket } from "socket.io";
import socketMensajes from "./public/socket/mensajes.js";

const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

//* Socket
io.on("connection", async (socket) => {
    socketMensajes(socket, io.sockets);
});

//* Modo como parámetro
const options = {
    alias: {
        m: "MODO",
    },
    default: {
        MODO: "FORK",
    }
}

const argv = process.argv.slice(2);
const { MODO } = ParseArgs(argv, options)
const PORT = process.env.PORT || 8080;

const cpu = cpus().length;

if (MODO == "CLUSTER") {
    if (cluster.isPrimary) {
        logger.info(`Primary: ${process.pid}`);

        //Fork workers
        for (let i = 1; i <= cpu; i++){
        cluster.fork();
        }

        cluster.on("exit", (worker) => {
        logger.info(`Worker with PID ${worker.process.pid} DOWN`);
        cluster.fork();
        })
    } else {
        DBConnect (()=> {
        const connectedServer = httpServer.listen(PORT, () => {
        logger.info(
            `Servidor http escuchando en el puerto ${PORT} en modo ${MODO} en el worker ${process.pid}`
            );
        });
        connectedServer.on("error", (error) =>
            logger.warn(`Error en servidor ${error}`)
        );
        })
    }
    } else {
    DBConnect (()=> {
        const connectedServer = httpServer.listen(PORT, () => {
        logger.info(
            `Servidor http escuchando en el puerto ${PORT} en modo ${MODO}`
        );
        });
        connectedServer.on("error", (error) =>
        logger.warn(`Error en servidor ${error}`)
        );
    })
}