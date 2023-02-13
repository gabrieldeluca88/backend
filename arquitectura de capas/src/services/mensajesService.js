const createError = require ("http-errors")
const fs = require ("fs/promises")
const path = require ("path")
const { sqlite } = require ("../persistence/SQL/BDmensajes")
const {MongoMensajesController} = require ("../persistence/mongodb/mensajesMongo.js")

const filePath = path.resolve(__dirname, '../../data/mensajes.json');

class ProductosAPI {
    constructor(archivo) {
        this.archivo = archivo;
    }

    async getAll(){
        const mensajes = await MongoMensajesController.getAllMensajes()
        return mensajes
    }

    async crearBD(){
        const mensajes = await fs.readFile(filePath, 'utf8');
        const arrayMensajes = JSON.parse(mensajes)
        await sqlite.createTable();
        await sqlite.insertMessage(arrayMensajes)
    }

    async saveNewMessage(message) {
        /*const mensajes = await fs.readFile(filePath, 'utf8');
        const arrayMensajes = JSON.parse(mensajes) 

        arrayMensajes.push(message);

        const newData = JSON.stringify(arrayMensajes, null, "\t")

        await fs.writeFile(filePath, newData)

        SQL:
        const mensajes = await sqlite.getAllMessages()
        const controller = await sqlite.insertMessage(message)*/
        const newMensaje = await MongoMensajesController.createMensaje(message)
        const mensajes = await MongoMensajesController.getAllMensajes()
        const newData = JSON.stringify(mensajes, null, "\t")

        await fs.writeFile(filePath, newData)

            return newMensaje
        }
}

const messageController = new ProductosAPI(filePath);

module.exports = {
    messageController
}