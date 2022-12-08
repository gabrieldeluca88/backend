const createError = require ("http-errors")
const fs = require ("fs/promises")
const path = require ("path")
const moment = require ("moment")
const { v4: uuidv4 } = require('uuid');
const {sql}  = require ("./BDproductos")

const { MongoProductosController } = require ("./productosMongo.js")

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
        /* FS:
        const productos = await fs.readFile(filePath, 'utf8');
        const arrayProductos = JSON.parse(productos); 
        SQL:
        const productos = await sql.getAllProducts()
        
        Mongo*/
        const productos = await MongoProductosController.getAllProducts()
        const indice = productos.findIndex(prod => prod.id == id);

        return indice >= 0;
    }

    async getAll() {
        //SQL: const productos = await sql.getAllProducts()
        const productos = await MongoProductosController.getAllProducts()
        return productos
    }

    async getById(id) {
        //SQL: const productos = await sql.getAllProducts()
        const existe = await this.exists(id)

        if(!existe) throw createError(404, 'producto no encontrado')

        const indice = await MongoProductosController.getProductById(id)
        return indice
    }

    async saveNewProduct(newProduct) {
        /* FS:
        const productos = await fs.readFile(filePath, 'utf8');
        const arrayProductos = JSON.parse(productos)
        SQL:
        const productos2 = await sql.getAllProducts() */

        const {title, price, thumbnail, descripcion, stock} = newProduct

        //fs y SQL: let newId = 1
        const time = moment().format("DD-MM-YYYY HH:MM:SS")
        const newCodigo = uuidv4();

        /* fs y SQL:
        if(productos2.length) {
            newId = productos2[productos2.length - 1].id + 1
        }
        const intId = Math.floor(newId) */
    
        const product = {
            title,
            price,
            thumbnail,
            timestamp : time,
            descripcion,
            codigo: newCodigo,
            stock
        }
        
        //SQL: const controller = await sql.insertProduct(product)

        const controller = await MongoProductosController.createProduct(product)

        return controller

        /*FS
        arrayProductos.push(product);
        const newData = JSON.stringify(arrayProductos, null, "\t")
        await fs.writeFile(filePath, newData)
            return product
        */
        } 

    async updateById (id, newProduct) {
        /*FS:
        const productos = await fs.readFile(filePath, 'utf8');
        const arrayProductos = JSON.parse(productos) 
        SQL:
        const productos = await sql.getAllProducts()*/

        /* FS y SQL:
        const indice = productos.findIndex(prod => prod.id == id);
        const product = productos[indice] 
        const intId = Math.floor(id)*/

        const product = await MongoProductosController.getProductById(id)

        const {title, price, thumbnail, descripcion, stock} = newProduct
        const {timestamp, codigo} = product

        const productoActualizado = {
            title,
            price,
            thumbnail,
            timestamp,
            descripcion,
            codigo,
            stock
        }
        
        const controller = await MongoProductosController.updateProduct(id, productoActualizado)

        //SQL: const controller = await sql.updateProduct(intId, productoActualizado)
        
        /* FS: 
        arrayProductos.splice(indice, 1, productoActualizado);
        const DataActualizada = JSON.stringify(arrayProductos, null, "\t")
        await fs.writeFile(filePath, DataActualizada) */

        return controller
    }

    async deleteById (id){
        /*FS:
        const productos = await fs.readFile(filePath, 'utf8');
        const arrayProductos = JSON.parse(productos)
        SQL: const productos = await sql.getAllProducts()
        
        const indice = productos.findIndex(prod => prod.id == id);
        const controller = await sql.deleteProductById(id)
        arrayProductos.splice(indice, 1);
        const newData = JSON.stringify(arrayProductos, null, "\t")
        await fs.writeFile(filePath, newData) */
        
        const controller = await MongoProductosController.deleteProduct(id)

        return `eliminando el producto con el id: ${id}`
    }

    async eliminarStock(idProducto){
        /*fs:
        const productos = await fs.readFile(filePath, 'utf8');
        const arrayProductos = JSON.parse(productos); 
        SQL:
        const productos = await sql.getAllProducts()
        const indice = productos.findIndex(prod => prod.id == idProducto);
        const product = productos[indice]
        */
        
        const existe = await this.exists(idProducto)

        if(!existe) throw createError(404, 'producto no encontrado')
        
        const producto = await MongoProductosController.getProductById(idProducto)

        const {title, price, thumbnail, timestamp, descripcion, codigo, stock} = producto;

        const newStock = stock - 1;

        const productoActualizado = {
            title,
            price,
            thumbnail,
            timestamp,
            descripcion,
            codigo,
            stock: newStock
        }

        const controller = await MongoProductosController.updateProduct(idProducto, productoActualizado)

        /*SQL:
        const constroller = await sql.updateStockById(idProducto, newStock);
        FS:
        arrayProductos.splice(indice, 1, newProduct);
        const DataActualizada = JSON.stringify(arrayProductos, null, "\t")
        await fs.writeFile(filePath, DataActualizada) */

        return "stock eliminado"
    }
}

const ProductosController = new ProductosAPI(filePath);



module.exports = {
    ProductosController
}