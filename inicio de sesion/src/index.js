require('dotenv').config()
const server = require ("./services/server")
const {initConnection} = require ("./db/database.js")

const puerto = process.env.PORT || 8080;

const init = async () => {
    await initConnection();

    server.listen(puerto, () => {
    console.log(`servidor listo, puerto: ${puerto}`)
})
}

init();