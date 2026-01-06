//Variables para recorrer y hacer validaciones
let minusculas = "abcdefghijklmnopqrstuvwxyz".split("");
let mayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
let numeros = "0123456789".split("");
let simbolos = "@$!%*?&#._-".split("");

const nombre = document.getElementById("nombre");
const telefono = document.getElementById("telefono");
const correo = document.getElementById("email");
const password = document.getElementById("contrasena");
const formulario = document.getElementById("formulario");

const errorNombre = document.getElementById("errorNombre");
const errorCorreo = document.getElementById("errorCorreo");
const errorPassword = document.getElementById("errorPassword");

let errorTelefono = document.createElement("small");
errorTelefono.className = "error";
telefono.insertAdjacentElement("afterend", errorTelefono);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// VALIDAR NOMBRE
nombre.addEventListener("input", () => {
  if (nombre.value.trim() === "") {
    errorNombre.textContent = "El nombre es obligatorio";
  } else if (!isNaN(nombre.value)) {
    errorNombre.textContent = "El nombre no puede ser solo números";
  } else if (nombre.value.length < 3) {
    errorNombre.textContent = "Debe tener al menos 3 caracteres";
  } else {
    errorNombre.textContent = "";
  }
});

// VALIDAR TELÉFONO
telefono.addEventListener("input", () => {
  if (telefono.value.trim() === "") {
    errorTelefono.textContent = "El teléfono es obligatorio";
  } else if (telefono.value.includes(" ")) {
    errorTelefono.textContent = "No debe contener espacios";
  } else if (isNaN(telefono.value)) {
    errorTelefono.textContent = "Solo números";
  } else if (telefono.value.length !== 10) {
    errorTelefono.textContent = "Debe tener 10 números";
  } else {
    errorTelefono.textContent = "";
  }
});

// VALIDAR CORREO
correo.addEventListener("input", () => {
  if (correo.value.trim() === "") {
    errorCorreo.textContent = "El correo es obligatorio";
  } else if (!emailRegex.test(correo.value)) {
    errorCorreo.textContent = "Correo no válido";
  } else {
    errorCorreo.textContent = "";
  }
});

// VALIDAR CONTRASEÑA
password.addEventListener("input", () => {
  let min = false, may = false, num = false, sim = false;

  const value = password.value;

  if (value.length < 8) {
    errorPassword.textContent = "Mínimo 8 caracteres";
    return;
  }

  for (let c of value) {
    if (minusculas.includes(c)){
      min = true;
    }else if (mayusculas.includes(c)){
      may = true;
    }else if (numeros.includes(c)){
      num = true;
    } 
    else if (simbolos.includes(c)){
      sim = true;
    } 
  }

  if (!min || !may || !num || !sim) {
    errorPassword.textContent =
      "Debe incluir al menos una mayúscula una minúscula un número y un símbolo";
  } else {
    errorPassword.textContent = "";
  }
});
 
// EVITAR ENVÍO SI HAY ERRORES
formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Formulario enviado correctamente ✅");
});

// Funcion para mostrar u ocultar la contraseña
let mostrar = false;
function mostrarPassword(){
  if(mostrar){
    contrasena.type = "password";
    mostrar = false;
  }else{
    contrasena.type = "text"
    mostrar = true;
  }
}

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



