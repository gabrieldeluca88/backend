import express from "express";
import http from "http";
import { initWsServer } from "./socket"
import rutaPrincipal from "../routes/index"
import { engine } from 'express-handlebars'
import path from "path"
import { ProductosController } from "../controller/productos"
import { messageController } from "../controller/mensajes"
import morgan from "morgan";

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

app.get("/productos", async (req, res) => {
    const data = await ProductosController.getAll()
    const cantidadObjetos = data.length
    const validarArray = cantidadObjetos > 0 ? true : false
    res.render("showProducts", { productos: data, cantidad: validarArray})
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
    const controller = await messageController.crearBD()
    res.json({
        msg: "Tabla creada!"
    })
})

const myServer = http.Server(app)

initWsServer(myServer)

export default myServer;
