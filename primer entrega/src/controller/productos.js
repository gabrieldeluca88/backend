var createError = require('http-errors')
const fs = require('fs/promises');
const path = require('path');

const filePath = path.resolve(__dirname, '../../productos.json');

class ProductosAPI {
    constructor(archivo) {
        this.archivo = archivo;
    }

    async exists(id) {
        const productos = await fs.readFile(filePath, 'utf8');
        const arrayProductos = JSON.parse(productos);
        const indice = arrayProductos.findIndex(prod => prod.id == id);

        return indice >= 0;
    }

    async getAll() {
        const productos = await fs.readFile(filePath, 'utf8');
        const arrayProductos = JSON.parse(productos)
        return arrayProductos
    }

    async getById(id) {
        const productos = await fs.readFile(filePath, 'utf8');
        const arrayProductos = JSON.parse(productos);
        const existe = await this.exists(id)

        if(!existe) throw createError(404, 'producto no encontrado')

        const indice = arrayProductos.findIndex(prod => prod.id == id);

        return arrayProductos[indice]
    }

    async saveNewProduct(newProduct) {
        const productos = await fs.readFile(filePath, 'utf8');
        const arrayProductos = JSON.parse(productos)

        const {title, price, thumbnail} = newProduct

        let newId = 1

        if(arrayProductos.length) {
            newId = arrayProductos[arrayProductos.length - 1].id + 1
        }

        const intId = Math.floor(newId)
    
        const product = {
            title,
            price,
            thumbnail,
            id: intId
        }

        arrayProductos.push(product);

        const newData = JSON.stringify(arrayProductos, null, "\t")

        await fs.writeFile(filePath, newData)
            return product
        }

    async updateById (id, newProduct) {
        const productos = await fs.readFile(filePath, 'utf8');
        const arrayProductos = JSON.parse(productos)
        const indice = arrayProductos.findIndex(prod => prod.id == id);

        const {title, price, thumbnail} = newProduct

        const intId = Math.floor(id)

        const productoActualizado = {
            title,
            price,
            thumbnail,
            id: intId,
        }

        arrayProductos.splice(indice, 1, productoActualizado);

        const DataActualizada = JSON.stringify(arrayProductos, null, "\t")
        await fs.writeFile(filePath, DataActualizada)

        return productoActualizado
    }

    async deleteById (id){
        const productos = await fs.readFile(filePath, 'utf8');
        const arrayProductos = JSON.parse(productos)
        const indice = arrayProductos.findIndex(prod => prod.id == id);

        arrayProductos.splice(indice, 1);

        const newData = JSON.stringify(arrayProductos, null, "\t")
        await fs.writeFile(filePath, newData)

        return `eliminando el producto con el id: ${id}`
    }
}

const instanciaProductosApi = new ProductosAPI(filePath);

module.exports = {
    ProductosController : instanciaProductosApi
}