let cartId;

const contenedorProductos = document.getElementById("productos");
const productosFiltrados = document.getElementById("productosFiltrados");

document.addEventListener("DOMContentLoaded", () => {
    getData();
    getUser();
})

//* Buscar el ID del usuario
const getUser = async () => {
    try {
        const res = await fetch ("/idUsuario");
        const data = await res.json();
        getCart(data);
    } catch (e) {
        throw new Error(`Error al buscar el ID del usuario: ${e}`)
    };
};

//* Traer el ID del carrito
const getCart = async (user) => {
    try {
        const res = await fetch (`api/carrito/idCarrito/${user}`);
        const data = await res.json();
        if (data._id === null) {
            createCart(user);
        } else {
            cartId = data._id;
        }
    }  catch (e) {
        throw new Error(`Error al buscar el ID del carrito: ${e}`)
    }
};

//* Crear carrito nuevo
export const createCart = async () => {
    try {
        await fetch(`/api/carrito`, { method: "POST" });
        location.reload();
    } catch (e) {
        throw new Error(`Error al crear el carrito: ${e}`)
    }
};

//* Traer productos de la BD
const getData = async () => {
    try {
        const res = await fetch("/api/productos");
        const data = await res.json();
        showProducts(data);
    } catch (e) {
        throw new Error(`Error al mostrar los productos: ${e}`)
    }
};

//* Renderizar productos
export const showProducts = async (data) => {
    data.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML += `
            <img id="image${product._id}" src=${product.thumbnail}>
            <h5 class="name">${product.name}</h5>
            <p class="description">${product.description}</p>
            <p>Stock: ${product.stock}</p>
            <p class="price">$${product.price}</p>
            <button class="boton-add" id="boton${product._id}">Agregar al carrito</button>
            `
        contenedorProductos.appendChild(div);
        const boton = document.getElementById(`boton${product._id}`)
        boton.addEventListener("click", () => {
            addProduct(product);
        });
    });
};

//* Agregar producto al carrito
const addProduct = async (product) => {
    try {
        const producto = {
            timestamp:product.timestamp,
            id_prod: product._id,
            name: product.name,
            description: product.description,
            code: product.code,
            thumbnail: product.thumbnail,
            price: product.price,
            quantity: 1,
            stock: product.stock,
            category: product.category,
        }
        const url = `api/carrito/${cartId}/productos`;
        await fetch (url, {
            method: "POST",
            body: JSON.stringify(producto),
            headers: {
                "Content-Type": "application/json",
            }
        })
    } catch (e) {
        throw new Error(`Error al agregar producto al carrito: ${e}`)
    }
}

//* Filtrar productos por categoría
const filterProducts = async (category) => {
    try {
        const res = await fetch(`api/productos/${category}`, { method: "POST" });
        const data = await res.json();
        contenedorProductos.remove();
        showFilterProducts(data);
    } catch (e) {
        throw new Error(`Error al filtrar productos: ${e}`)
    }
}

const showFilterProducts = async (data) => {
    data.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML += `
            <a href="/productos/${product._id}"><img id="image${product._id}" src=${product.thumbnail}></a>
            <h5 class="name">${product.name}</h5>
            <p class="description">${product.description}</p>
            <p>Stock: ${product.stock}</p>
            <p class="price">$${product.price}</p>
            <button class="boton-add" id="boton${product._id}">Agregar al carrito</button>
            `
        productosFiltrados.appendChild(div);
        const boton = document.getElementById(`boton${product._id}`)
        boton.addEventListener("click", () => {
            addProduct(product);
        });
    });
};

const madera = document.getElementById("maderayceramica");
madera.addEventListener("click", () => {
    filterProducts("maderayceramica");
});

const alfombra = document.getElementById("alfombra");
alfombra.addEventListener("click", () => {
    filterProducts("alfombra");
});


