const { Router } = require('express')
const fs = require('fs/promises');
const path = require('path');
const admin = require("../middlewares/auth")
const { ProductosController } = require("../controller/productos")

const filePath = path.resolve(__dirname, '../../productos.json');

const rutaProductos = Router();

rutaProductos.get("/formulario", async (req, res) => {
    /*render con HBS:*/
    res.render("formularioHbs") 
})

rutaProductos.get("/productos", async (req, res) => {
    const data = await ProductosController.getAll()
    const cantidadObjetos = data.length
    const validarArray = cantidadObjetos > 0 ? true : false
    res.render("showProducts", { productos: data, cantidad: validarArray})
})

rutaProductos.get("/", async (req, res) => {
    const data = await ProductosController.getAll()
    const cantidadObjetos = data.length
    const validarArray = cantidadObjetos > 0 ? true : false
    res.render("main", { productos: data, cantidad: validarArray})
    /* Render con Hbs: */
    //res.render("showProducts", { productos: data, cantidad: validarArray})
})

rutaProductos.get("/product", async (req, res) => {
    const { id } = req.query;
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

    let newId = 1

    if(arrayProductos.length) {
        newId = arrayProductos[arrayProductos.length - 1].id + 1
    }

    // se guarda la informacion que paso el usuario

    const data = req.body;

    console.log(data);

    const {title, price, thumbnail} = req.body

    // se verifica que el precio sea un numero y que sean los campos correctos

    const priceNumber = Math.floor(price)

    if(!title || !price || !thumbnail){
        return res.status(400).json({
            msg: "Campos invalidos"
        })
    }

    // se crea un nuevo usuario y se le envia al controlador

    let nuevoUsuario = {
        title,
        price: priceNumber,
        thumbnail
    }

    const dataController = await ProductosController.saveNewProduct(nuevoUsuario)
})

rutaProductos.put("/:id", admin, async (req, res) => {
    const id = req.params.id;
    const {title, price, thumbnail} = req.body
    const priceNumber = Math.floor(price)

    if(!title || !price || !thumbnail){
        return res.status(400).json({
            msg: "Campos invalidos"
        })
    }

    const productoActualizado = {
        title,
        price: priceNumber,
        thumbnail
    }

    const DataActualizada = await ProductosController.updateById(id, productoActualizado)

    console.log(id)

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

module.exports = rutaProductos;