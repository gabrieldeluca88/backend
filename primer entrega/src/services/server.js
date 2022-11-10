const express = require('express');
const http = require('http');
const io = require('socket.io');
const { initWsServer } = require ("./socket")
const rutaPrincipal = require('../routes/index')
const { engine } = require('express-handlebars');
const path = require('path');
const { ProductosController } = require("../controller/productos")
const { getWsServer } = require('../services/socket')

const viewsFolderPath = path.resolve(__dirname, '../../views');
const layoutsFolderPath = `${viewsFolderPath}/layouts`
const layoutPorDefecto = `${layoutsFolderPath}/index.hbs`
const partialsFolderPath = `${viewsFolderPath}/partials`

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static("public"))

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

app.get("/", (req, res) => {
    res.render("links")
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

const myServer = http.Server(app)

initWsServer(myServer)

module.exports = myServer;