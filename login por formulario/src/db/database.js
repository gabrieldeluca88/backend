const mongoose = require ('mongoose');

const connection = process.env.MONGO_ATLAS || "mongodb://localhost:27017/ecommerce" 

const initConnection = async () => {
    try {
        console.log("Conectando...");
        await mongoose.connect(connection);
        console.log("Se conecto con exito :)")
    } catch (error) {
        console.log(`ERROR => ${error}`);
        return error
    }
}

const initDesconnection = async () => {
    try {
        console.log("Desconectando...");
        await mongoose.disconnect();
        console.log("Se desconecto con exito :)")
    } catch (error) {
        console.log(`ERROR => ${error}`);
        return error
    }
}

module.exports = {initConnection, initDesconnection}