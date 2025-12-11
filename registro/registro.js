const formulario = document.getElementById("formulario");

//Variables para recorrer y hacer validaciones
const minusculas = "abcdefghijklmnopqrstuvwxyz".split("");
const mayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const numeros = "0123456789".split("");
const simbolos = "@$!%*?&".split("");

//Funcion-boton para capturar la info del fomulario
formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    //Variables para elementos del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const email = document.getElementById("email").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //Variables para validacion de correo
    let min = false;
    let may = false;
    let num = false;
    let sim = false;

    //Validaciones y alertas con SweetAlert
    if (nombre === "" || telefono === "" || email === "" || contrasena === "" ) {
            Swal.fire("Error", "Todos los campos son obligatorios", "error");
            return;
    }
    if (!isNaN(nombre)) {
    return Swal.fire("Error", "El nombre no puede ser solo números.", "error");
    }
    if (telefono.length !== 10 || telefono.includes(" ")) {
    return Swal.fire("Error", "El teléfono debe tener 10 números y no debe contener espacios.", "error");
    }
    if (isNaN(telefono)) {
    return Swal.fire("Error", "El teléfono solo debe contener números.", "error");
    }
    if (!emailRegex.test(email)) {
    return Swal.fire("Error", "Ingresa un correo válido.", "error");
    }
    if (contrasena.length < 8 || contrasena.includes(" ")) {
        return Swal.fire("Error", "La contraseña debe tener mínimo 8 caracteres y no debe tener espacios", "error");
    }
    if (contrasena === nombre) {
    return Swal.fire("Error", "La contraseña no puede ser igual al usuario.", "error");
    }
    for (let letra of minusculas) {
        if (contrasena.includes(letra)) {
            min = true;
            break;
        }
    }
    for (let letra of mayusculas) {
       if (contrasena.includes(letra)) {
            may = true;
            break;
        }
    }
    for (let numero of numeros) {
       if (contrasena.includes(numero)) {
            num = true;
            break;
        }
    }
    for (let simbolo of simbolos) {
       if (contrasena.includes(simbolo)) {
            sim = true;
            break;
        }
    }
    if (!min || !may || !num || !sim) {
        Swal.fire("Error", "La contraseña debe tener al menos una minúscula, una mayúscula, un número y un símbolo.", "error");
        return;
    }

    //Creación del objeto usuario
    const usuario = { nombre, telefono, email, contrasena };

    //Conversión del usuario en JSON
    localStorage.setItem("usuario", JSON.stringify(usuario));

    //Alerta final de creación de usuario exitoso
    Swal.fire("Registrado", "Usuario guardado correctamente");

    //Limpieza de campo del formulario
    document.getElementById("nombre").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("email").value = "";
    document.getElementById("contrasena").value = "";
});



