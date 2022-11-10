const { Router } = require('express')
const productos = require("../routes/productos")
const carritos = require("../routes/carrito")

const rutaPrincipal = Router();

rutaPrincipal.use("/productos", productos)

rutaPrincipal.use("/carrito", carritos)

module.exports = rutaPrincipal;