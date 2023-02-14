const  Router = require ("express")
const path = require ("path")
const admin = require ("../middlewares/auth")
const info = require ("../middlewares/logger.js")
const Productos = require ("../controller/productosController.js")


const rutaProductos = Router();

rutaProductos.get("/", info, Productos.getAllProducts)

rutaProductos.get("/:id", info, Productos.getProductById)

rutaProductos.post("/", info, admin, Productos.newProducto)

rutaProductos.put("/:id", info, admin, Productos.editarProducto)

rutaProductos.delete("/:id", info, admin, Productos.eliminarProducto)

module.exports = rutaProductos;