import { Router } from "express";
import { CarritosDao } from "../daos/DAOFactory.js";

const router = Router();

const carrito = CarritosDao;

//* Crear carrito
router.post ("/", async (req,res) =>{
    try {
        const id_user = req.user._id;
        const address = req.user.address;
        const products = [];
        const timestamp = new Date();
        const id = await carrito.save({ timestamp, products, id_user, address });
        res.send(id)
    } catch (e){
        res.status(404).json({ error: `Error al crear el carrito: ${e}` })
    }
})

//* Eliminar el carrito
router.delete ("/:id", async (req, res) =>{
    try {
        const { id } = req.params;
        let found = await carrito.deleteById(id)
        if (found) {
            res.status(200).json("Carrito eliminado");
        } else {
            res.status(404)({ error: "Carrito no encontrado" })
        }
    } catch (e){
        res.status(404).json({ error: `Error al eliminar el carrito: ${e}` })
    }
})

//* Listar los productos de un carrito
router.get("/:id/productos", async (req, res) => {
    try {
        const { id } = req.params;
        let found = await carrito.getById(id);
        if (found) {
            const { products } = found;
            res.send(products);
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    } catch (e){
        res.status(404).json({ error: `Error al listar productos del carrito: ${e}` })
    }
});

//* Agregar productos al carrito
router.post("/:id/productos", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            id_prod,
            timestamp,
            name,
            description,
            code,
            thumbnail,
            price,
            quantity,
            category,
            stock,
        } = req.body;
        await carrito.saveProducts(
            id,
            id_prod,
            timestamp,
            name,
            description,
            code,
            thumbnail,
            price,
            quantity,
            category,
            stock
        );
        return res.send("Producto Cargado");
    } catch (e) {
        res.status(404).json({ error: `Error al agregar producto al carrito: ${e}` })
    }
});

//* Eliminar un producto del carrito
router.delete("/:id/productos/:id_prod", async (req, res) =>{
    try {
        const { id, id_prod } = req.params;
        await carrito.deleteProdById(id, id_prod);
        res.status(200).json("Producto eliminado");
    } catch (e) {
        res.status(404).json({ error: `Error al eliminar producto del carrito: ${e}` })
    }
});

//* Buscar el carrito del usuario
router.get("/idCarrito/:id_user", async (req,res) => {
    try {
        const { id_user } = req.params;
        let found = await carrito.getUserCart(id_user);
        if (found) {
            res.send(found);
        } else {
            res.send({ _id: null });
        }
    } catch (e) {
        res.status(404).json({ error: `Error al buscar el carrito del usuario: ${e}` })
    }
});

//* Actualizar carrito a finalizado para crear la orden
router.put("/:id_user", async (req, res) => {
    try {
        const { id_user } = req.params;
        await carrito.updateCart(id_user);
        res.status(200).json("Se actualizó el carrito a finalizado")
    } catch (e) {
        res.status(404).json({ error: `Error al actualizar el carrito: ${e}` })
    }
})


export default router;