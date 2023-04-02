import express from "express";
import session from "express-session";
import path from "path";
import MongoStore from "connect-mongo";
import homeRouter from "./routes/home.js";
import passport from "passport";
import * as dotenv from "dotenv";
import mainProductos from "./routes/mainProductos.js"
import mainCarritos from "./routes/mainCarritos.js"
import chatRouter from "./routes/chat.js";
import orderRouter from "./routes/ordenes.js";
import variablesEnv from "./routes/variables.js";

dotenv.config();

const DATABASE = process.env.DATABASE;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join("public")));

app.set("views", "./views");
app.set("view engine", "ejs");


app.use(
    session({
        store: MongoStore.create({
        mongoUrl: `${DATABASE}`,
        }),
        secret: "secreto",
        resave: false,
        saveUninitialized: false,
        //ttl: 600000,
        cookie: {
            maxAge: 600000,
        },
    })
);

//*Passport
app.use(passport.initialize());
app.use(passport.session());

//* Rutas
app.use("/api/productos", mainProductos);
app.use("/api/carrito", mainCarritos);
app.use("/chat", chatRouter);
app.use("/ordenes", orderRouter);
app.use("/variables", variablesEnv);
app.use(homeRouter);

export default app;
