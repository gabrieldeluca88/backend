let cartId;
let userId;

const contenedorCarrito = document.getElementById("carrito-contenedor");


document.addEventListener("DOMContentLoaded", (e)=>{
    getUser();
});

//* Buscar el ID del usuario
const getUser = async () => {
    try {
        const res = await fetch ("/idUsuario");
        const data = await res.json();
        getCart(data);
    } catch (e) {
        throw new Error (`Error al buscar el usuario ${e}`);
    };
};

//* Traer el ID del carrito
const getCart = async (user) => {
    try {
        const res = await fetch (`api/carrito/idCarrito/${user}`);
        const data = await res.json();
        cartId = data._id;
        userId = user;
        showCart(user);
    }  catch (e) {
        throw new Error (`Error al buscar el carrito ${e}`);
    }
};

//* Mostrar el carrito
const showCart = async (user) => {
    try {
        const res = await fetch (`api/carrito/${cartId}/productos`);
        const products = await res.json();
        if (products.length === 0) {
            contenedorCarrito.innerHTML = `
            <p class="carrito-vacio">El carrito está vacío</p>
            `
        } else {
            products.forEach (product => {
                const calcularTotal= () => {
                    let total = `${product.price}`*`${product.quantity}`;
                    return total;
                }
                const div = document.createElement("div");
                div.classList.add("productoEnCarrito");
                div.innerHTML = `
                <p class="product-cart">${product.name}</p>
                <p class="product-cart">$${product.price}</p>
                <p class="product-cart">${product.quantity}</p>
                <p class="product-cart">Total: $${calcularTotal()}</p>
                <button class="boton-delete" id="eliminar${product._id}">Eliminar</button>
            `
            contenedorCarrito.appendChild(div);
            const btnEliminar = document.getElementById(`eliminar${product._id}`)
            btnEliminar.addEventListener("click", () => {
                deleteProduct(product);
                })
            })
            const btnFinalizar = document.getElementById("btn-finalizar");
            btnFinalizar.innerHTML = `
            <button class="btn-finalizar">Finalizar compra</button>
            `
            btnFinalizar.addEventListener("click", () => {
                finishCart(user);
                })
            const calcularTotalOrden = () => {
                const total = products.reduce((acc, prod) => acc + (prod.price * prod.quantity), 0)
                return total;
            }
            const totalCarrito = document.getElementById("total-carrito")
            totalCarrito.innerHTML = `Total del carrito: $${calcularTotalOrden()}`
        }
    } catch (e) {
        throw new Error(`Error al mostrar los productos del carrito ${e}`);
    };
};

//* Eliminar producto
const deleteProduct = async (product) => {
    const id_prod = product._id;
    try {
        await fetch(`/api/carrito/${cartId}/productos/${id_prod}`, { method: "DELETE" });
        location.reload();
    } catch (e) {
        throw new Error(`Error al eliminar el producto del carrito ${e}`);
    }
};

//* Finalizar compra
const finishCart = async (user) => {
    try {
        await fetch(`/api/carrito/${user}`, { method: "PUT" });
        await fetch(`/api/carrito`, { method: "POST" });
        location.reload();
        createOrder(user);
    } catch (e) {
        throw new Error(`Error al actualizar el carrito a finalizado ${e}`);
    }
}

const createOrder = async () => {
    try {
        await fetch (`/ordenes/${cartId}`, { method: "POST" })
    } catch (e) {
        throw new Error(`Error al crear la orden ${e}`);
    }
}


