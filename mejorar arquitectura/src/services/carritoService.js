const createError = require ("http-errors")
const fs = require ("fs/promises")
const path = require ("path")
const {MongoCarritoController} = require ("../persistence/mongodb/carritoMongo.js")

const filePath = path.resolve(__dirname, '../../carritos.json');

class CarritoAPI {
    constructor(archivo) {
        this.archivo = archivo;
    }

    async exists(id) {
        /*const carrito = await fs.readFile(filePath, 'utf8');
        const arrayCarritos = JSON.parse(carrito); */
        const arrayCarritos = await MongoCarritoController.getAllCarrito()
        const indice = arrayCarritos.findIndex(prod => prod.id == id);

        return indice >= 0;
    }

    async getById(id) {
        /* FS:
        const carrito = await fs.readFile(filePath, 'utf8');
        const arrayCarrito = JSON.parse(carrito); */
        const existe = await this.exists(id)

        if(!existe) throw createError(404, 'carrito no encontrado')

        /* FS:const indice = arrayCarrito.findIndex(prod => prod.id == id);

        const carritoSeleccionado = arrayCarrito[indice]

        const productosDelCarrito = carritoSeleccionado.products*/
        
        const carrito = await MongoCarritoController.getCarritoById(id)

        const productosDelCarrito = carrito.products

        return productosDelCarrito
    }

    async saveNewCar() {
        /* FS:
        const carrito = await fs.readFile(filePath, 'utf8');
        const arrayCarrito = JSON.parse(carrito)

        let newId = 1

        if(arrayCarrito.length) {
            newId = arrayCarrito[arrayCarrito.length - 1].id + 1
        }

        const intId = Math.floor(newId)
    
        const product = {
            id: intId,
            products: []
        }

        arrayCarrito.push(product);

        const newData = JSON.stringify(arrayCarrito, null, "\t")

        await fs.writeFile(filePath, newData) */
        
        const product = await MongoCarritoController.createNewCarrito([])
        
        return product
    }

    async saveNewProduct(producto, idCarrito) {
        const existe = await this.exists(idCarrito)
        let cantidad = 1;
        let newProduct = {}

        const {title, price, thumbnail, id, descripcion, codigo} = producto

        if(!existe) throw createError(404, 'carrito no encontrado')

        const carrito = await MongoCarritoController.getCarritoById(idCarrito)

        const productosDelCarrito = carrito.products
        const indiceProducto = productosDelCarrito.findIndex(prod => prod.id == id);

        if(indiceProducto >= 0){
            const productoYaExiste = productosDelCarrito[indiceProducto]
            let newCantidad = productoYaExiste.cantidad
            cantidad = cantidad + newCantidad;

            newProduct = {
                title,
                price, 
                thumbnail,
                id,
                descripcion,
                codigo,
                cantidad
            }

            productosDelCarrito.splice(indiceProducto, 1, newProduct)
        } else { 
            newProduct = {
                title,
                price, 
                thumbnail,
                id,
                descripcion,
                codigo,
                cantidad
            }

            productosDelCarrito.push(newProduct);
        }

        const update = await MongoCarritoController.updateCarrito(idCarrito, productosDelCarrito)

        return productosDelCarrito

        /*FS:
        
        const carrito = await fs.readFile(filePath, 'utf8');
        const arrayCarrito = JSON.parse(carrito);
        const existe = await this.exists(idCarrito)
        const indiceCarrito = arrayCarrito.findIndex(prod => prod.id == idCarrito)
        let cantidad = 1;

        const {title, price, thumbnail, id, descripcion, codigo} = producto

        if(!existe) throw createError(404, 'carrito no encontrado')

        const carritoSeleccionado = arrayCarrito[indiceCarrito]

        const productosDelCarrito = carritoSeleccionado.products
        const indiceProducto = productosDelCarrito.findIndex(prod => prod.id == id);

        let productoYaExiste = productosDelCarrito[indiceProducto]
        
        if(productoYaExiste){
            let newCantidad = productoYaExiste.cantidad
            cantidad = cantidad + newCantidad;
        }
        const boolean = indiceProducto >= 0

        if(!boolean){

        const newProduct = {
            title,
            price, 
            thumbnail,
            id,
            descripcion,
            codigo,
            cantidad
        }

        productosDelCarrito.push(newProduct);
        } else {
            productoYaExiste.cantidad = cantidad
            productosDelCarrito.splice(indiceProducto, 1, productoYaExiste)
        }

        const carritoActualizado = {
            id: carritoSeleccionado.id,
            products : productosDelCarrito
        }

        arrayCarrito.splice(indiceCarrito, 1, carritoActualizado)

        const newData = JSON.stringify(arrayCarrito, null, "\t")

        await fs.writeFile(filePath, newData)

        return productosDelCarrito*/
    }

    async deleteCartById (id) {
        /*const carrito = await fs.readFile(filePath, 'utf8');
        const arrayCarrito = JSON.parse(carrito);

        const indice = arrayCarrito.findIndex(prod => prod.id == id);

        arrayCarrito.splice(indice, 1)

        const newData = JSON.stringify(arrayCarrito, null, "\t")
        await fs.writeFile(filePath, newData) */

        const carritoEliminado = await MongoCarritoController.deleteCarrito(id)

        return `eliminando el carrito con el id: ${id}`
    }

    async deleteProductoById (idCarrito, idProducto){
        const carrito = await MongoCarritoController.getCarritoById(idCarrito)
        const productos = carrito.products

        const productoIndice = productos.findIndex(prod => prod.id == idProducto)

        productos.splice(productoIndice, 1)

        const update = await MongoCarritoController.updateCarrito(idCarrito, productos)
        
        /* FS:
        const carrito = await fs.readFile(filePath, 'utf8');
        const arrayCarrito = JSON.parse(carrito);
        const indiceCarrito = arrayCarrito.findIndex(prod => prod.id == idCarrito)

        const carritoSeleccionado = arrayCarrito[indiceCarrito]
        const productosDelCarrito = carritoSeleccionado.products

        const productoIndice = productosDelCarrito.findIndex(prod => prod.id == idProducto)

        productosDelCarrito.splice(productoIndice, 1)

        const carritoActualizado = {
            id: carritoSeleccionado.id,
            products : productosDelCarrito
        }

        arrayCarrito.splice(indiceCarrito, 1, carritoActualizado)

        const newData = JSON.stringify(arrayCarrito, null, "\t")

        await fs.writeFile(filePath, newData)*/

        return `se elimino el producto con el id ${idProducto} del carrito con el id ${idCarrito}`
    }
}

const carritoServices = new CarritoAPI(filePath);

module.exports = {
    carritoServices
}