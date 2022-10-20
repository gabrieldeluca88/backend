const { Router } = require('express')
const productos = require("../routes/productos")

const rutaPrincipal = Router();

rutaPrincipal.use("/productos", productos)

module.exports = rutaPrincipal;