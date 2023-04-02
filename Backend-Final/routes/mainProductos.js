import { Router } from "express";
import { ProductosDao } from "../daos/DAOFactory.js";

const router = Router();

const productos = ProductosDao;

const authAdmin = (req, res, next) => {
    const admin = true;
        if (admin) {
        next();
        } else {
            const route = req.originalUrl;
            const method = req.method;
            res.status(401).json({
                error: -2,
                descripcion: `Ruta ${route} método ${method} no autorizada`,
    });
}}

//* Listar productos disponibles
router.get("/", async (req, res) =>{
    try {
        const products = await productos.getAll();
        res.send(products)
    } catch (e){
        res.status(404).json({ error: `Error al listar los productos: ${e}` })
    }
});

//* Filtrar según categoría
router.post("/:category", async (req, res) => {
    const { category } = req.params;
    try {
        const products = await productos.getByCategory(category);
        if (products){
            res.send(products);
        } else {
            res.status(404).json({ error: "categoría no encontrada" })
        }
    } catch (e) {
        res.status(404).json({ error: `Error al listar los productos por categoría: ${e}` })
    }
})

//*Buscar según ID
router.get("/:id", async (req,res) =>{
    try {
        const { id } = req.params;
        let found = await productos.getById(id);
        if (found){
            res.send(found)
        } else {
            res.status(404).json({ error:"producto no encontrado" })
        }
    } catch (e){
        res.status(404).json({ error: `Error al buscar producto: ${e}` })
    }
})

//*Agregar productos al listado
router.post("/", authAdmin, async (req, res) =>{
    const timestamp = new Date();
    try {
        const { name, price, description, code, thumbnail, stock, category } = req.body;
        const id = await productos.save({ name, price, description, code, thumbnail, stock, timestamp, category });
        res.send(`Se agregó el producto: ${name} con ID ${id}`)
    } catch (e) {
        res.status(404).json({ error: `Error al guardar producto: ${e}` })
    }
})

//*Actualizar por ID
router.put("/:id", authAdmin, async (req, res) =>{
    const timestamp = new Date();
    try {
        const { id } = req.params;
        const { name, price, description, code, thumbnail, stock } = req.body;
        const found = await productos.updateById({ id, name, price, description, code, thumbnail, stock, timestamp });
        if (found) {
            res.send(`Se reemplazó el producto con ID ${id} por ${name}`)
        } else {
            res.status(404).json({ error: "Producto no encontrado" })
        }
    } catch (e){
        res.status(404).json({ error: "Producto no encontrado" })
    }
})

//*Borrar por ID
router.delete("/:id", authAdmin, async (req, res) =>{
    try {
        const { id } = req.params;
        let found = await productos.deleteById(id);
        if (found) {
            res.send(`Se eliminó el producto con ID ${id}`)
        } else {
            res.status(404).json({ error: "Producto no encontrado" })
        }
    } catch (e){
        res.status(404).json({ error: `Error al eliminar producto: ${e}` })
    }
})

export default router;