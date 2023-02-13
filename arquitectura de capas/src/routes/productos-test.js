const { Router } = require ("express")
const { faker } = require('@faker-js/faker');
const moment = require ("moment")
const { v4: uuidv4 } = require('uuid');
const info = require ("../middlewares/logger.js")

const rutaProductosTest = Router();

rutaProductosTest.get("/", info, async (req, res) => {
    let respuesta = [];
    for (let i = 0; i < 5; i++) {
        const time = moment().format("DD-MM-YYYY HH:MM:SS");
        const newCodigo = uuidv4();
        const newStock = faker.random.numeric(3);
        const newStockNumber = Math.floor(newStock)

        respuesta.push({
            id: faker.database.mongodbObjectId(),
            title: faker.commerce.product(),
            price: faker.commerce.price(100, 200, 0, '$'),
            thumbnail: faker.image.animals(1234, 2345, true),
            timestamp: time,
            descripcion: faker.commerce.productDescription(),
            codigo: newCodigo,
            stock: newStockNumber
        })
    }

    res.json({
        data: respuesta
    })
})

module.exports = rutaProductosTest;