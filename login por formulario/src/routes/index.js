const  Router = require ("express")
const productos = require ("../routes/productos")
const carritos = require ("../routes/carrito")
const productosTest = require ("../routes/productos-test.js")


const rutaPrincipal = Router();

rutaPrincipal.use("/productos", productos)

rutaPrincipal.use("/carrito", carritos)

rutaPrincipal.use("/productos-test", productosTest)

module.exports = rutaPrincipal;