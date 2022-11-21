const createError = require('http-errors')
const fs = require('fs/promises');
const path = require('path');
const  {sqlite} = require("./BDmensajes");

const filePath = path.resolve(__dirname, '../../mensajes.json');

class ProductosAPI {
    constructor(archivo) {
        this.archivo = archivo;
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

        await fs.writeFile(filePath, newData)*/
        const mensajes = await sqlite.getAllMessages()
        const controller = await sqlite.insertMessage(message)
            return message
        }

}

const messageController = new ProductosAPI(filePath);

module.exports = {
    messageController
}