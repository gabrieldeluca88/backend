const express = require ("express");
const http = require ("http");
const  {initWsServer}  = require ("./socket")
const rutaPrincipal = require ("../routes/index")
const  {engine} = require ('express-handlebars')
const path = require ("path")
const  {ProductosController} = require ("../controller/productos")
const  {messageController} = require ("../controller/mensajes")
const morgan = require ("morgan");

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
    res.render("main", { productos: data, cantidad: validarArray})
})

/* app.get("/productos", async (req, res) => {
    const data = await ProductosController.getAll()
    const cantidadObjetos = data.length
    const validarArray = cantidadObjetos > 0 ? true : false
    res.render("showProducts", { productos: data, cantidad: validarArray})
}) */

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
    const controller = await messageController.crearBD()
    res.json({
        msg: "Tabla creada!"
    })
})


app.get("/productos", async (req, res) => {
    const controller = await ProductosController.crearBD()
    res.json({
        msg: "Tabla creada!"
    })
})
const myServer = http.Server(app)

initWsServer(myServer)

module.exports = myServer;