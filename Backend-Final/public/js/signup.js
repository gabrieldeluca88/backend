//* Validación de contraseñas
const password = document.getElementById("password");
const password2 = document.getElementById("password2");
const error = document.getElementById("errorPassword");

const registro = document.getElementById("registrar")

password2.addEventListener ("mouseout", () => {
    if (password.value.length > 0 && password2.value.length > 0){
        validatePass();
    }
});

const validatePass = () => {
    if (password.value != password2.value) {
        error.innerHTML = "Las contraseñas no coinciden, reingrese"
        registro.classList.add("ocultar");
    } else {
        error.innerHTML = "Las contraseñas coinciden, puede registrarse"
        registro.classList.remove("ocultar");
    }
}


