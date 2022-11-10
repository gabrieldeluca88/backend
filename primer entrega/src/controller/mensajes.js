var createError = require('http-errors')
const fs = require('fs/promises');
const path = require('path');

const filePath = path.resolve(__dirname, '../../mensajes.json');

class ProductosAPI {
    constructor(archivo) {
        this.archivo = archivo;
    }

    async saveNewMessage(message) {
        const mensajes = await fs.readFile(filePath, 'utf8');
        const arrayMensajes = JSON.parse(mensajes)

        arrayMensajes.push(message);

        const newData = JSON.stringify(arrayMensajes, null, "\t")

        await fs.writeFile(filePath, newData)
            return message
        }

}

const instanciaProductosApi = new ProductosAPI(filePath);

module.exports = {
    messageController: instanciaProductosApi
}