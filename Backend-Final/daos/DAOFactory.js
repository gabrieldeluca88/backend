import * as dotenv from "dotenv";
dotenv.config();
const TIPO = process.env.TIPO;

import ProductosDaoMongoDB from "./productos/ProductosDaoMongoDB.js";
import CarritosDaoMongoDB from "./carritos/CarritosDaoMongoDB.js";
import MensajesDaoMongoDB from "./mensajes/MensajesDaoMongoDB.js";
import OrdenesDaoMongoDB from "./ordenes/OrdenesDaoMongoDB.js";

let ProductosDao;
let CarritosDao;
let MensajesDao;
let OrdenesDao;

switch (TIPO) {
    case "mongoDB":
        ProductosDao = new ProductosDaoMongoDB();
        CarritosDao = new CarritosDaoMongoDB();
        MensajesDao = new MensajesDaoMongoDB();
        OrdenesDao = new OrdenesDaoMongoDB();
    break;
}

export { ProductosDao };

export { CarritosDao };

export { MensajesDao };

export { OrdenesDao };
