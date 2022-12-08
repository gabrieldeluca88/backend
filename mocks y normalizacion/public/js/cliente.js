// el cliente hace la coneccion con el servidor

const socket = io.connect();

const form = document.getElementById('formulario');
const userName = document.getElementById('userName');
const userText = document.getElementById('userText');
const divMensajes = document.getElementById('mensajes');

form?.addEventListener('submit', (event) => {
    event.preventDefault();

    const cartaServer = {
        email: userName.value,
        message: userText.value
    }    
    
    console.log(cartaServer);

    socket.emit("eventoTextoUsuario", cartaServer);

    userText.value = ""; 
})

// para recibir la respuesta del server

socket.on("respuestaMensaje", (data) => {
    const realData = JSON.stringify(data)
    console.log(`El servidor me respondio con la data: ${realData}`)
});

// crear HTML dinamico PARA TODOS

socket.on("notifGeneral", (data) => {
    const newData = data.data;
    const realData = JSON.stringify(data)
    console.log(`El servidor envio una notificacion: ${realData}`)
    const body = document.createElement("div");
    body.classList.add("mensajeContenedor")

    const titulo = document.createElement("h4");
    titulo.classList.add("tittleMensaje")
    titulo.textContent = newData.email;

    const divContenedor = document.createElement("div");
    divContenedor.classList.add("mensajeTexto")

    const time = document.createElement("p");
    time.classList.add("horaMensaje")
    time.textContent = newData.time;

    const mensaje = document.createElement("p");
    mensaje.classList.add("texto")
    mensaje.textContent = newData.message;
    
    divContenedor.appendChild(time)
    divContenedor.appendChild(mensaje)

    body.appendChild(titulo);
    body.appendChild(divContenedor);

    divMensajes.appendChild(body)
})

const formProductos = document.getElementById("formProductos")
const title = document.getElementById("title")
const price = document.getElementById("price")
const thumbnail = document.getElementById("thumbnail")

const tableContent = document.getElementById("tableContent")

formProductos?.addEventListener("submit", (event) => {
    event.preventDefault();

    const cartaServer = {
        title: title.value,
        price: price.value,
        thumbnail : thumbnail.value
    }   
    
    console.log(cartaServer);

    socket.emit("eventoNuevoProducto", cartaServer);

    title.value = "";
    price.value = "";
    thumbnail.value = "";
})

socket.on("crearNuevoProducto", (data) => {
    const newData = data.data;
    const realData = JSON.stringify(data)

    const trProduct = document.createElement("tr");
    const tdId = document.createElement("td");
    tdId.innerText = newData.id;

    const tdTitle = document.createElement("td");
    tdTitle.innerText = newData.title;

    const tdPrice = document.createElement("td");
    tdPrice.innerText = `${newData.price} $`;

    const tdThumbnail = document.createElement("td");
    const divImg = document.createElement("div");
    divImg.classList.add("contenedor_img");
    const productImg = document.createElement("img");
    productImg.classList.add("img")
    productImg.setAttribute("src", newData.thumbnail);
    productImg.setAttribute("alt", newData.title);


    trProduct.appendChild(tdId)
    trProduct.appendChild(tdTitle);
    trProduct.appendChild(tdPrice);
    trProduct.appendChild(tdThumbnail);
    divImg.appendChild(productImg)
    tdThumbnail.appendChild(divImg);
    
    tableContent.appendChild(trProduct);
})