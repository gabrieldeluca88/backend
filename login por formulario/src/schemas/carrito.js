const mongoose = require ("mongoose");
const {productosCollectionName} = require ("./productos.js")

const carritoCollectionName = "carritos"

const carritoSchema = new mongoose.Schema({
    products: {type : Array , "default" : []}
})

const CarritoModel = mongoose.model(carritoCollectionName, carritoSchema)


module.exports= {
    carritoCollectionName,
    CarritoModel
}