const {CarritoModel} = require ("../schemas/carrito.js")

class ClientMongo {
    async getAllCarrito() {
        const carritos = await CarritoModel.find();
        return carritos
    }

    async getCarritoById(id) {
        const carrito = await CarritoModel.findById(id);
        if(!carrito){
            return "Producto no encontrado "
        }

        return carrito
    }

    async createNewCarrito (array){
        const newCarrito = await CarritoModel.create({products: array})

        return newCarrito
    }

    async updateCarrito (id, objeto){
        const carritoUpdated = await CarritoModel.findByIdAndUpdate(
            id,
            { products: objeto },
            { new: true }
        );

        return carritoUpdated
    }

    async deleteCarrito (id){
        const carrito = await CarritoModel.findByIdAndDelete(id)
        const data = {
            msg: "Producto eliminado",
            carrito
        }

        return data
    }
}

const MongoCarritoController = new ClientMongo();

module.exports = {
    MongoCarritoController
}