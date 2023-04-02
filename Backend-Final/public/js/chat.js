const socket = io.connect();

//*CHAT --Form Ingreso
const email = document.getElementById("email");
const mensaje = document.getElementById("mensaje");

//* Enviar mensaje y validación de campos vacíos
const formPublicarMensaje = document.getElementById("formPublicarMensaje");
formPublicarMensaje.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!mensaje.value){
        mensaje.focus();
        return (errorMsj.textContent = "Complete este campo")
    } else {
        mensaje.focus();
        errorMsj.textContent = "";
    }
    const message = {
        message: mensaje.value,
        id_user: email.textContent,
    };
    mensaje.value="";
    mensaje.focus();
    socket.emit("newMensaje", message)
})

  //*CHAT --Mostrar Mensajes
    const renderMessages = (mensajes) => {
    const html = mensajes
        .map((msj) => {
        return `
            <div class="historial">
                <b style="color:blue;">${msj.id_user}</b>
                [<span style="color:brown;">${msj.timestamp}</span>] :
                <i style="color:green;">${msj.message}</i>
            </div>`;
        })
        .join(" ");
        document.getElementById("mensajes").innerHTML = html;
};

    socket.on("mensajes", (data) => {
    renderMessages(data)
});


//* Filtro de mensajes propios
const filtroMensajes = document.getElementById("filtroMensajes");
const dataEmail = email.textContent;

const getMessages = async (dataEmail) => {
    try {
        const res = await fetch(`/chat/${dataEmail}`);
        const data = await res.json()
        data.forEach(msg => {
            const div = document.createElement("div");
            div.classList.add("misMensajes");
            div.innerHTML += `
                <p class="msj">${msg.message}</p>
                `
            filtroMensajes.appendChild(div);
        });
    } catch (e) {
        throw new Error(`Error al filtrar los mensajes: ${e}`)
    }
}

const btnFiltro = document.getElementById("btn-filtro");

btnFiltro.addEventListener("click", () => {
    getMessages(dataEmail);
});
