import { Schema } from "mongoose";
import ContenedorMongoDB from "../../contenedores/ContenedorMongoDB.js";

const products = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
})

class OrdenesDaoMongoDB extends ContenedorMongoDB {
    constructor() {
        super ("ordenes", {
            timestamp: { type: Date, required: true},
            products: [products],
            id_user: { type: String, required: true },
            status: { type: String, default: "generada" },
            number: { type: Number, required: true },
            total: { type: Number }
        })
    }
}

export default OrdenesDaoMongoDB;