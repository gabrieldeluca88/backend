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
const cookieParser = require ("cookie-parser")
const session = require ('express-session');
const MongoStore = require('connect-mongo');
const passport = require ("passport");
const {loginFunc, signUpFunc} = require ("../services/auth.js")

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

const mySecret = "mySecret"
app.use(cookieParser(mySecret));

const ttlSeconds = 180;

const connection = process.env.MONGO_ATLAS || "mongodb://localhost:27017/ecommerce" 

const StoreOptions = {
    store: MongoStore.create({
        mongoUrl: connection,
        crypto: {
            secret: '1234',     
        },
    }),
    secret: 'secretString', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: ttlSeconds * 1000,
    },
};

app.use(session(StoreOptions))

app.use(passport.initialize());
app.use(passport.session());

passport.use("login", loginFunc);
passport.use("signup", signUpFunc);

const users = [
    {
        username: 'rodolfo',
        password : '1234',
        admin: true,
    },
    {
        username: 'pedro',
        password : '123456',
        admin: false,
    }
]

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const index = users.findIndex((user) => user.username === username && user.password === password)

    console.log(index);

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

    if(index < 0) {
        res.status(401).json({msg: "No estas autorizado"});
    } else {
        const user = users[index];
        req.session.info = {
            username: user.username,
            loggedIn: true,
            contador: 1,
            admin: user.admin,
        }

        res.render("main", { nombre: user.username, productos: respuesta, cantidad: validarArray})
    }
})

app.post("/login-json", async (req, res) => {
    const { username, password } = req.body;

    const index = users.findIndex((user) => user.username === username && user.password === password)

    console.log(index);

    if(index < 0) {
        res.status(401).json({msg: "No estas autorizado"});
    } else {
        const user = users[index];
        req.session.info = {
            username: user.username,
            loggedIn: true,
            contador: 1,
            admin: user.admin,
        }

        res.json({msg: `Bienvenido ${user.username}`})
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.render("loginDespedida")
});

app.post('/logout-json', (req, res) => {
    req.session.destroy();
    res.json({msg: "Session destruida"})
});

app.get("/login", (req, res) => {
    res.render("loginHbs")
})

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


app.get("/info", (req, res) => {
    const directorio = process.cwd();
    const idProcesoActual = process.pid;
    const versionNode = process.version;
    const nombreProceso = process.title;
    const sistemaOperativo = process.platform;
    const memory = JSON.stringify(process.memoryUsage())

    res.json({
        msg: "datos...",
        directorio,
        idProcesoActual,
        versionNode,
        nombreProceso,
        sistemaOperativo,
        memoriaTotal: memory
    })
})


app.get('/slow', function (req, res) {
    console.log(`PID= ${process.pid}`);
    let sum = 0;
    for (let i = 0; i < 15006500445; i++) {
        sum += i;
    }

    res.json({
        pid: process.pid,
        sum,
    });
});


const myServer = http.Server(app)

initWsServer(myServer)

module.exports = myServer;