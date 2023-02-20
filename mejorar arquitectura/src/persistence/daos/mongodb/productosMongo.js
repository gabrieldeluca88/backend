const {ProductsModel} = require ("./schemas/productos.js")

class ClientMongo {
    async getAllProducts() {
        const productos = await ProductsModel.find();
        return productos
    }

    async getProductById(id) {
        const product = await ProductsModel.findById(id);
        if(!product){
            return "Producto no encontrado :c"
        }

        return product
    }

    async createProduct (object){
        const {title, price,thumbnail,timestamp,descripcion,codigo,stock} = object
        const newProduct = await ProductsModel.create({
            title,
            price,
            thumbnail,
            timestamp,
            descripcion,
            codigo,
            stock
        })

        return newProduct
    }

    async updateProduct (id, array){
        const {title, price,thumbnail,timestamp,descripcion,codigo,stock} = array
        const product = await ProductsModel.findById(id);
        if(!product){
            return "Producto no encontrado :("
        }
        const productUpdated = await ProductsModel.findByIdAndUpdate(
            id,
            { title, price,thumbnail,timestamp,descripcion,codigo,stock },
            { new: true }
        );

        return productUpdated
    }

    async deleteProduct (id){
        const product = await ProductsModel.findByIdAndDelete(id)
        const data = {
            msg: "Producto eliminado",
            product
        }

        return data
    }
}

const MongoProductosController = new ClientMongo();

module.exports = {
    MongoProductosController , ClientMongo
}