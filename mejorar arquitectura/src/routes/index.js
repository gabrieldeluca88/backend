const  Router = require ("express")
const productos = require ("../routes/productos")
const carritos = require ("../routes/carrito")
const productosTest = require ("../routes/productos-test.js")
const rutaUsuarios = require ("../routes/usuarios.js")
const rutaRandom = require ("../routes/randoms.js")


const rutaPrincipal = Router();

rutaPrincipal.use("/productos", productos)

rutaPrincipal.use("/carrito", carritos)

rutaPrincipal.use("/productos-test", productosTest)

rutaPrincipal.use("/user", rutaUsuarios)

rutaPrincipal.use("/randoms", rutaRandom)

module.exports = rutaPrincipal;