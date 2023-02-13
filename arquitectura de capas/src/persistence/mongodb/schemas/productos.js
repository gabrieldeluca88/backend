const mongoose = require ("mongoose");

const productosCollectionName = "productos"

const productosSchema = new mongoose.Schema({
    title: {type: String, required: true},
    price: {type: Number, required: true},
    thumbnail: {type: String, required: true},
    timestamp: {type: String, required: true},
    descripcion: {type: String, required: true},
    codigo: {type: String, required: true},
    stock: {type: Number, required: true},
})

const ProductsModel = mongoose.model(productosCollectionName, productosSchema)


module.exports = {
    productosCollectionName,
    ProductsModel
}