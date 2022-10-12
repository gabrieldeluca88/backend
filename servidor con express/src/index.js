class Contenedor {
    constructor(nombreArchivo) {
    this.nombreArchivo = nombreArchivo;
    }

    async getAll() {
    try {
        const data = await fs.promises.readFile(this.nombreArchivo, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.log("No se pudo traer los productos!", error);
    }
    }
}

const fs = require("fs");
const nombreArchivo = "../productos.json";
const file = new Contenedor(nombreArchivo);

const express = require("express");
const path = require("path");
const app = express();
const puerto = 8080;

const server = app.listen(puerto, () =>
    console.log("Server http escuchando en puerto", puerto)
);

server.on("error", (error) => {
    console.log("Error en el servidor!", error);
});

app.get("/productos", async (req, res) => {
    try {
    let products = await file.getAll();

    if (products.length == 0) {
        res.send({
        respuesta: "El archivo no tiene productos",
        });
    } else {
        res.send({
        respuesta: products,
        });
    }
    } catch (error) {
    console.log("Error al traer los productos!", error);
    }
});

app.get("/productoRandom", async (req, res) => {
    try {
    let products = await file.getAll();

    if (products.length == 0) {
        res.send({
        respuesta: "El archivo no tiene productos para mostrar",
        });
    } else {
        res.send({
          respuesta: products[Math.floor(Math.random() * products.length)],
        });
    }
    } catch (error) {
    console.log("Error al traer el productoRandom!", error);
    }
});