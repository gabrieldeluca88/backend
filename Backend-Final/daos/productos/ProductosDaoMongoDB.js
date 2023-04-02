import logger from "../../config/log4JS.js"
import ContenedorMongoDB from "../../contenedores/ContenedorMongoDB.js";

class ProductosDaoMongoDB extends ContenedorMongoDB {
    constructor(){
        super ("productos", {
            timestamp: { type: Date, required:true },
            name: { type:String, required: true },
            description: { type:String, required:true },
            category: { type: String, required:true },
            code: { type: Number, required:true },
            thumbnail: { type:String, required: true },
            price: { type:Number, required: true },
            stock: { type:Number, required: true },
        })
    }

    async getByCategory (category){
        try {
            const find = await this.collection.find({ category: category });
            if (find){
                return find;
            } else {
                return "La categoría no existe"
            }
        } catch (e) {
            logger.error(`Error en DAO productos al filtrar por categoría: ${e}`)
        }
    }
}

export default ProductosDaoMongoDB;