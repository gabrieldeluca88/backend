const { Router } = require ("express")
const { fork } = require ('child_process');
const path = require ('path')

const direccion = path.resolve(__dirname, '../utils/calculo.js');

const rutaRandom = Router();

rutaRandom.get('/', (req, res) => {
    const {cant} = req.query;
    const cantidad = parseFloat(cant)
    const computo = fork(direccion, [cantidad]);
    computo.send('inicio');
    computo.on("message", (sum) => {
        res.json({
            resultado: sum,
        });
    });
});

module.exports = rutaRandom;