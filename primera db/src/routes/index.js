import { Router } from ('express')
import productos  from ("../routes/productos")

const rutaPrincipal = Router();

rutaPrincipal.use("/productos", productos)

export default rutaPrincipal;