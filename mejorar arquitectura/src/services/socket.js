const io = require ("socket.io")
const  {messageController} = require ("./mensajesService")
const moment = require ("moment")
const  {ProductosController} = require ("./productosService")

let myWebSocketServer;

const initWsServer = (server) => {
    //creacion del servidor de webSocket usando socket.io
    myWebSocketServer = io(server);

    myWebSocketServer.on("connection", (socket) => {
        console.log("Se acaba de conectar un cliente!")
    
        //este es el id para enviar cosas del server al cliente
        console.log("ID del servidor socket", socket.id)
    
        //este es el id para enviar cosas del cliente al servidor
        console.log("ID del cliente socket", socket.client.id)

        socket.on("eventoNuevoProducto", async (dataUsuario) => {
            const dataController = await ProductosController.saveNewProduct(dataUsuario)
            const newData = await ProductosController.getAll()
            const newProductId = newData[newData.length - 1].id
            const newProduct = await ProductosController.getById(newProductId)
            
            myWebSocketServer.emit("crearNuevoProducto", {
                data: newProduct
            })
        })
    
        socket.on("eventoTextoUsuario", async (dataUsuario) => {
            console.log(`el cliente ${socket.client.id} me acaba de enviar el mensaje con el evento eventoTextoUsuario`)

            const newMessage = {
                email: dataUsuario.email,
                message: dataUsuario.message,
                time: moment().format("DD-MM-YYYY HH:MM:SS"),
            }

            console.log(newMessage)

            const dataController = await messageController.saveNewMessage(newMessage)

            socket.emit("respuestaMensaje", { 
                data: dataUsuario
            })
    
            myWebSocketServer.emit("notifGeneral", {
                mensaje: "LLego un nuevo mensaje",
                data: newMessage
            })
        })
    })

    return myWebSocketServer
}

const getWsServer = () => {
    return myWebSocketServer;
}

module.exports = {
    initWsServer,
    getWsServer
}
