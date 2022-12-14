const express = require ("express");
const http = require ("http");
const  {initWsServer}  = require ("./socket")
const rutaPrincipal = require ("../routes/index")
const  {engine} = require ('express-handlebars')
const path = require ("path")
const  {ProductosController} = require ("../controller/productos")
const  {messageController} = require ("../controller/mensajes")
const morgan = require ("morgan");
const { faker } = require('@faker-js/faker');
const moment = require ("moment")
const { v4: uuidv4 } = require('uuid');
const { normalizado, desnormalizar } = require ("../controller/normalizado.js")

faker.locale = "es"

const viewsFolderPath = path.resolve(__dirname, '../../views');
const layoutsFolderPath = `${viewsFolderPath}/layouts`
const layoutPorDefecto = `${layoutsFolderPath}/index.hbs`
const partialsFolderPath = `${viewsFolderPath}/partials`

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static("public"))

app.use(morgan("dev"));

/* Views creadas con hbs:*/

app.set('view engine', 'hbs');
app.set('views', viewsFolderPath);

app.engine('hbs', engine({
    layoutsDir: layoutsFolderPath,
    extname: "hbs",
    defaultLayout: layoutPorDefecto,
    partialsDir: partialsFolderPath
}
));

app.get("/", async (req, res) => {
    const data = await ProductosController.getAll()
    const cantidadObjetos = data.length
    const validarArray = cantidadObjetos > 0 ? true : false

    let respuesta = []

    for (let i = 0; i < data.length; i++) {
        respuesta.push({
            id: data[i]._id,
            title: data[i].title,
            price: data[i].price,
            thumbnail: data[i].thumbnail,
            timestamp: data[i].timestamp,
            descripcion: data[i].descripcion,
            codigo: data[i].codigo,
            stock: data[i].stock
        })
        
    }

    res.render("main", { productos: respuesta, cantidad: validarArray})
})

app.get("/productos", async (req, res) => {
    const data = await ProductosController.getAll()
    let respuesta = []
    for (let i = 0; i < data.length; i++) {
        respuesta.push({
            id: data[i]._id,
            title: data[i].title,
            price: data[i].price,
            thumbnail: data[i].thumbnail,
            timestamp: data[i].timestamp,
            descripcion: data[i].descripcion,
            codigo: data[i].codigo,
            stock: data[i].stock
        })
        
    }
    const cantidadObjetos = data.length
    const validarArray = cantidadObjetos > 0 ? true : false
    res.render("showProducts", { productos: respuesta, cantidad: validarArray})
})

app.get("/productos-test", async (req, res) => {
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

    const cantidadObjetos = respuesta.length
    const validarArray = cantidadObjetos > 0 ? true : false

    res.render("showProducts", { productos: respuesta, cantidad: validarArray})
})

app.get("/formulario", (req, res) => {
    res.render("formularioHbs")
})

app.use((err, req, res, next) => {
    const status = err.status || 500;
        const message = err.message || "internal server error";

        console.log(err.stack)

        res.status(status).json(
            {
                message
            }
        )
})

app.use("/api", rutaPrincipal)

app.get("/mensajes", async (req, res) => {
    const controller = await messageController.getAll()
    res.json({
        data : controller
    })
})

app.post("/mensajes", async (req, res) => {
    const {email, nombre, apellido, edad, alias, avatar, text} = req.body

    const edadNum = Math.floor(edad)

    const objetoUsuario = {
        email,
        nombre,
        apellido,
        edad: edadNum,
        alias,
        avatar
    }

    const newMensaje = {
        author: objetoUsuario,
        text
    }

    const controller = await messageController.saveNewMessage(newMensaje)

    res.json({
        data: controller
    })
})

app.get("/mensajes-normalizados", async (req, res) => {
    const data = await normalizado();
    res.json({
        data
    })
})

app.get("/mensajes-desnormalizados", async (req, res) => {
    const data = await desnormalizar();
    res.json({
        data
    })
})

const myServer = http.Server(app)

initWsServer(myServer)

module.exports = myServer;