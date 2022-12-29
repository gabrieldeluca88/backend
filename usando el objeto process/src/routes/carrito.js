const { Router } = require ("express")
const { carritoController } = require ("../controller/carrito")
const { ProductosController } = require ("../controller/productos")

const rutaCarrito = Router();

rutaCarrito.get("/:id/productos", async (req, res) => {
    const id = req.params.id;
    try{
        const data = await carritoController.getById(id)
        console.log(data)
        res.json({
            msg: `Productos agregados al carrito con el id ${id}`,
            data
        })
    }catch (err) {
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

rutaCarrito.post("/:idCarrito/productos/:idProducto", async (req, res) =>{
    const idProducto= req.params.idProducto;
    const idCarrito = req.params.idCarrito
    const product = await ProductosController.getById(idProducto);
    const dataController = await carritoController.saveNewProduct(product, idCarrito)
    const eliminarStock = await ProductosController.eliminarStock(idProducto)
    res.json({
        data: `se guardo el producto con exito en el carrito con el id ${idCarrito}`,
        msg: dataController
    })
})

rutaCarrito.delete("/:idCarrito/productos/:idProducto", async (req, res) => {
    const idCarrito = req.params.idCarrito;
    const idProducto = req.params.idProducto
    const message = await carritoController.deleteProductoById(idCarrito, idProducto)
    res.json({
        msg: message
    })
})

module.exports = rutaCarrito;