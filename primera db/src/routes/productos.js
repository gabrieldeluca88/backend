import { Router } from "express"
import fs from "fs/promises"
import path from "path"
import admin from "../middlewares/auth"
import { ProductosController } from "../controller/productos"
import { sql } from "../controller/BDproductos"

const filePath = path.resolve(__dirname, '../../productos.json');

const rutaProductos = Router();

rutaProductos.get("/", async (req, res) => {
    const data = await ProductosController.getAll()
    const dataController = await ProductosController.crearBD()
    res.json({
        data
    })
})

rutaProductos.get("/:id", async (req, res) => {
    const id = req.params.id;
    try{
        const product = await ProductosController.getById(id);

        res.json({
            msg: `id del productos: ${id}`,
            msg2: product
        })
    } catch (err) {
        const status = err.status || 500;
        const message = err.message || "internal server error";

        console.log(err.stack)

        res.status(status).json(
            {
                message
            }
        )
    }
})

rutaProductos.post("/", admin, async (req, res) => {
    //se guarda el nuevo ID para el producto
    const productos = await fs.readFile(filePath, 'utf8');
    const arrayProductos = JSON.parse(productos)
    const productos2 = await sql.getAllProducts()

    let newId = 1

    if(productos2.length) {
        newId = productos2[productos2.length - 1].id + 1
    }

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
        return res.status(400).json({
            msg: "Campos invalidos"
        })
    }

    // se crea un nuevo usuario y se le envia al controlador

    let nuevoUsuario = {
        title,
        price: priceNumber,
        thumbnail,
        descripcion,
        stock: stockNumber
    }

    const dataController = await ProductosController.saveNewProduct(nuevoUsuario)

    res.json({
        msg: `Se agrego el producto con el id: ${newId}`,
        data: nuevoUsuario
    })
})

rutaProductos.put("/:id", admin, async (req, res) => {
    const id = req.params.id;
    const {title, price, thumbnail, descripcion, stock} = req.body

    const priceNumber = Math.floor(price)
    const stockNumber = Math.floor(stock)
    const comprobarPrecio = isNaN(priceNumber)
    const comprobarStock = isNaN(stockNumber)

    if(!title || !price || !thumbnail || !descripcion || !stock || comprobarPrecio || comprobarStock){
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
})

rutaProductos.delete("/:id", admin, async (req, res) => {
    const id = req.params.id;
    const message = await ProductosController.deleteById(id)

    res.json({
        msg: message
    })
})

export default rutaProductos;