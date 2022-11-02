const server = require("./services/server")
const puerto = 8080

server.listen(puerto, () => {
    console.log(`servidor escuchando, puerto: ${puerto}`)
})