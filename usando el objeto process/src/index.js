require('dotenv').config()
const server = require ("./services/server")
const {initConnection} = require ("./db/database.js")
const minimist = require  ('minimist');

const objetoConfiguracion = {
    alias: {
        p: "port"
    },
    default: {
        port: 8080,
    }
}

const args = minimist(process.argv, objetoConfiguracion);

const puerto = args.port;

const init = async () => {
    await initConnection();

    server.listen(puerto, () => {
    console.log(`servidor listo, puerto: ${puerto}`)
})
}

init();