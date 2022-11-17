import server from "./services/server"

const puerto = process.env.PORT || 8080;

server.listen(puerto, () => {
    console.log(`servidor listo, puerto: ${puerto}`)
})