const { Router } = require('express')
const { carritoController } = require("../controller/carrito")
const { ProductosController } = require("../controller/productos")

const rutaCarrito = Router();

rutaCarrito.get("/:id/productos", async (req, res) => {
    const id = req.params.id;
    const data = await carritoController.getById(id)
    console.log(data)
    res.json({
        msg: `Productos agregados al carrito con el id ${id}`,
        data
    })
})

rutaCarrito.post("/", async (req, res) =>{
    const dataController = await carritoController.saveNewCar()
    res.json({
        msg: dataController
    })
})

rutaCarrito.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const message = await carritoController.deleteCartById(id)
    res.json({
        msg: message
    })
})

rutaCarrito.post("/:idCarrito/productos/:id", async (req, res) =>{
    const id = req.params.id;
    const idCarrito = req.params.idCarrito
    const product = await ProductosController.getById(id);
    const dataController = await carritoController.saveNewProduct(id, product, idCarrito)
    res.json({
        data: `se guardo el producto con exito en el carrito con el id ${idCarrito}`,
        msg: dataController
    })
})

rutaCarrito.delete("/:id/productos/:idProducto", async (req, res) => {
    const id = req.params.id;
    const idProducto = req.params.idProducto
    const message = await carritoController.deleteProductoById(id, idProducto)
    res.json({
        msg: message
    })
})

module.exports = rutaCarrito;