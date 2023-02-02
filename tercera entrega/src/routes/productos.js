const  Router = require ("express")
const fs = require("fs/promises")
const path = require ("path")
const admin = require ("../middlewares/auth")
const  {ProductosController}  = require ("../controller/productos")
/* const  {sql} = require ("../controller/BDproductos") */
const info = require ("../middlewares/logger.js")
const logger = require ("../utils/logger.js")

const filePath = path.resolve(__dirname, '../../productos.json');

const rutaProductos = Router();

rutaProductos.get("/", info, async (req, res) => {
    try {
        const data = await ProductosController.getAll()
        res.json({
            data
        })
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || "internal server error";

        logger.error(message)

        res.status(status).json(
            {
                message
            }
        )
    }
    
})

rutaProductos.get("/:id", info, async (req, res) => {
    const id = req.params.id;
    try{
        const product = await ProductosController.getById(id);1

        res.json({
            msg: `id del productos: ${id}`,
            msg2: product
        })
    } catch (err) {
        const status = err.status || 500;
        const message = err.message || "internal server error";

        logger.error(message)

        res.status(status).json(
            {
                message
            }
        )
    }
})

rutaProductos.post("/", info, admin, async (req, res) => {
    //se guarda el nuevo ID para el producto
    /*const productos = await fs.readFile(filePath, 'utf8');
    const arrayProductos = JSON.parse(productos)
    const productos2 = await sql.getAllProducts()

    let newId = 1

    if(productos2.length) {
        newId = productos2[productos2.length - 1].id + 1
    }*/

    // se guarda la informacion que paso el usuario

    const data = req.body;

    console.log(data);

    const {title, price, thumbnail, descripcion, stock} = req.body

    // se verifica que el precio sea un numero y que sean los campos correctos

    const priceNumber = Math.floor(price)
    const stockNumber = Math.floor(stock)
    const comprobarPrecio = isNaN(priceNumber)
    const comprobarStock = isNaN(stockNumber)

    if(!title || !price || !thumbnail || !descripcion || !stock || comprobarPrecio || comprobarStock){
        logger.error("campos invalidos")
        return res.status(400).json({
            msg: "Campos invalidos"
        })
    }

    // se crea un nuevo usuario y se le envia al controlador

    let nuevoProducto = {
        title,
        price: priceNumber,
        thumbnail,
        descripcion,
        stock: stockNumber
    }

    const dataController = await ProductosController.saveNewProduct(nuevoProducto)

    res.json({
        msg: `Se agrego el producto`,
        data: dataController
    })
})

rutaProductos.put("/:id", info, admin, async (req, res) => {
    try{
    const id = req.params.id;
    const {title, price, thumbnail, descripcion, stock} = req.body

    const priceNumber = Math.floor(price)
    const stockNumber = Math.floor(stock)
    const comprobarPrecio = isNaN(priceNumber)
    const comprobarStock = isNaN(stockNumber)

    if(!title || !price || !thumbnail || !descripcion || !stock || comprobarPrecio || comprobarStock){
        logger.error("Campos invalidos")
        return res.status(400).json({
            msg: "Campos invalidos"
        })
    }

    const productoActualizado = {
        title,
        price: priceNumber,
        thumbnail,
        descripcion,
        stock: stockNumber
    }

    const DataActualizada = await ProductosController.updateById(id, productoActualizado)

    res.json({
        msg: `actualizando el producto con el id: ${id}`,
        data: DataActualizada,
    })
    }catch (err) {
        const status = err.status || 500;
        const message = err.message || "internal server error";

        logger.error(message)

        res.status(status).json(
            {
                message
            }
        )
    }
})

rutaProductos.delete("/:id", info, admin, async (req, res) => {
    const id = req.params.id;
    try{
        const message = await ProductosController.deleteById(id)

        res.json({
            msg: message
        })
    } catch (err) {
        const status = err.status || 500;
        const message = err.message || "internal server error";

        logger.error(message)

        res.status(status).json(
            {
                message
            }
        )
    }
})

module.exports = rutaProductos;