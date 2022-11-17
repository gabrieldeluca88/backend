import createError from "http-errors"
import fs from "fs/promises"
import path from "path"
import moment from "moment"
import { v4 as uuidv4 } from 'uuid';
import { sql } from "./BDproductos"

const filePath = path.resolve(__dirname, '../../productos.json');

class ProductosAPI {
    constructor(archivo) {
        this.archivo = archivo;
    }

    async crearBD(){
        const productos = await fs.readFile(filePath, 'utf8');
        const arrayProductos = JSON.parse(productos)
        await sql.createTable();
        await sql.insertProduct(arrayProductos)
    }

    async exists(id) {
        /*const productos = await fs.readFile(filePath, 'utf8');
        const arrayProductos = JSON.parse(productos); */
        const productos = await sql.getAllProducts()
        const indice = productos.findIndex(prod => prod.id == id);

        return indice >= 0;
    }

    async getAll() {
        const productos = await sql.getAllProducts()
        return productos
    }

    async getById(id) {
        const productos = await sql.getAllProducts()
        const existe = await this.exists(id)

        if(!existe) throw createError(404, 'producto no encontrado')

        const indice = productos.findIndex(prod => prod.id == id);

        return productos[indice]
    }

    async saveNewProduct(newProduct) {
        //const productos = await fs.readFile(filePath, 'utf8');
        //const arrayProductos = JSON.parse(productos)

        const productos2 = await sql.getAllProducts()

        const {title, price, thumbnail, descripcion, stock} = newProduct

        let newId = 1
        const time = moment().format("DD-MM-YYYY HH:MM:SS")
        const newCodigo = uuidv4();

        if(productos2.length) {
            newId = productos2[productos2.length - 1].id + 1
        }

        const intId = Math.floor(newId)
    
        const product = {
            title,
            price,
            thumbnail,
            id: intId,
            timestamp : time,
            descripcion,
            codigo: newCodigo,
            stock
        }
        
        const controller = await sql.insertProduct(product)

        //arrayProductos.push(product);

        //const newData = JSON.stringify(arrayProductos, null, "\t")

        /*await fs.writeFile(filePath, newData)
            return product*/
        } 

    async updateById (id, newProduct) {
        /*const productos = await fs.readFile(filePath, 'utf8');
        const arrayProductos = JSON.parse(productos) */
        const productos = await sql.getAllProducts()
        const indice = productos.findIndex(prod => prod.id == id);
        const product = productos[indice]

        const {title, price, thumbnail, descripcion, stock} = newProduct
        const {timestamp, codigo} = product

        const intId = Math.floor(id)

        const productoActualizado = {
            title,
            price,
            thumbnail,
            timestamp,
            descripcion,
            codigo,
            stock
        }

        const controller = await sql.updateProduct(intId, productoActualizado)

        //arrayProductos.splice(indice, 1, productoActualizado);

        //const DataActualizada = JSON.stringify(arrayProductos, null, "\t")
        //await fs.writeFile(filePath, DataActualizada)

        return productoActualizado
    }

    async deleteById (id){
        //const productos = await fs.readFile(filePath, 'utf8');
        //const arrayProductos = JSON.parse(productos)
        const productos = await sql.getAllProducts()
        const indice = productos.findIndex(prod => prod.id == id);

        const controller = await sql.deleteProductById(id)

        //arrayProductos.splice(indice, 1);

        /*const newData = JSON.stringify(arrayProductos, null, "\t")
        await fs.writeFile(filePath, newData) */

        return `eliminando el producto con el id: ${id}`
    }

    async eliminarStock(idProducto){
        /*const productos = await fs.readFile(filePath, 'utf8');
        const arrayProductos = JSON.parse(productos); */
        const productos = await sql.getAllProducts()
        const existe = await this.exists(idProducto)

        if(!existe) throw createError(404, 'producto no encontrado')

        const indice = productos.findIndex(prod => prod.id == idProducto);

        const product = productos[indice]

        const {title, price, thumbnail, id, timestamp, descripcion, codigo, stock} = product;

        const newStock = stock - 1;

        const newProduct = {
            title,
            price,
            thumbnail,
            id,
            timestamp,
            descripcion,
            codigo,
            stock : newStock
        }

        const constroller = await sql.updateStockById(idProducto, newStock);

        /*arrayProductos.splice(indice, 1, newProduct);
        const DataActualizada = JSON.stringify(arrayProductos, null, "\t")
        await fs.writeFile(filePath, DataActualizada) */

        return "stock eliminado"
    }
}

const ProductosController = new ProductosAPI(filePath);

export {
    ProductosController
}