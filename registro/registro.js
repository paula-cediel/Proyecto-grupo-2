// ==========================
// CREAR ADMIN SI NO EXISTE
// ==========================
if (!localStorage.getItem("usuarios")) {
  const usuarios = [
    {
      nombre: "Administrador",
      telefono: "0000000000",
      correo: "admin@letalcosplay.com",
      password: "Admin123",
      rol: "admin"
    }
  ];
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

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
// ==========================
// VARIABLES PARA VALIDACIONES
// ==========================
let minusculas = "abcdefghijklmnopqrstuvwxyz".split("");
let mayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
let numeros = "0123456789".split("");
let simbolos = "@$!%*?&#._-".split("");

const nombreInput = document.getElementById("nombre");
const telefonoInput = document.getElementById("telefono");
const correoInput = document.getElementById("email");
const passwordInput = document.getElementById("contrasena");
const formulario = document.getElementById("formulario");

const errorNombre = document.getElementById("errorNombre");
const errorCorreo = document.getElementById("errorCorreo");
const errorPassword = document.getElementById("errorPassword");

let errorTelefono = document.createElement("small");
errorTelefono.className = "error";
telefonoInput.insertAdjacentElement("afterend", errorTelefono);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==========================
// VALIDACIONES EN TIEMPO REAL
// ==========================

// NOMBRE
nombreInput.addEventListener("input", () => {
  if (nombreInput.value.trim() === "") {
    errorNombre.textContent = "El nombre es obligatorio";
  } else if (!isNaN(nombreInput.value)) {
    errorNombre.textContent = "El nombre no puede ser solo números";
  } else if (nombreInput.value.length < 3) {
    errorNombre.textContent = "Debe tener al menos 3 caracteres";
  } else {
    errorNombre.textContent = "";
  }
});

// TELÉFONO
telefonoInput.addEventListener("input", () => {
  if (telefonoInput.value.trim() === "") {
    errorTelefono.textContent = "El teléfono es obligatorio";
  } else if (telefonoInput.value.includes(" ")) {
    errorTelefono.textContent = "No debe contener espacios";
  } else if (isNaN(telefonoInput.value)) {
    errorTelefono.textContent = "Solo números";
  } else if (telefonoInput.value.length !== 10) {
    errorTelefono.textContent = "Debe tener 10 números";
  } else {
    errorTelefono.textContent = "";
  }
});

// CORREO
correoInput.addEventListener("input", () => {
  if (correoInput.value.trim() === "") {
    errorCorreo.textContent = "El correo es obligatorio";
  } else if (!emailRegex.test(correoInput.value)) {
    errorCorreo.textContent = "Correo no válido";
  } else {
    errorCorreo.textContent = "";
  }
});

// CONTRASEÑA
passwordInput.addEventListener("input", () => {
  let min = false, may = false, num = false, sim = false;
  const value = passwordInput.value;

  if (value.length < 8) {
    errorPassword.textContent = "Mínimo 8 caracteres";
    return;
  }

  for (let c of value) {
    if (minusculas.includes(c)) min = true;
    else if (mayusculas.includes(c)) may = true;
    else if (numeros.includes(c)) num = true;
    else if (simbolos.includes(c)) sim = true;
  }

  if (!min || !may || !num || !sim) {
    errorPassword.textContent =
      "Debe incluir mayúscula, minúscula, número y símbolo";
  } else {
    errorPassword.textContent = "";
  }
});

// ==========================
// REGISTRO DE USUARIO
// ==========================
formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = nombreInput.value.trim();
  const telefono = telefonoInput.value.trim();
  const correo = correoInput.value.trim();
  const password = passwordInput.value.trim();

  if (!nombre || !telefono || !correo || !password) {
    Swal.fire("Error", "Todos los campos son obligatorios", "error");
    return;
  }

  // Obtener usuarios existentes
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // Verificar correo duplicado
  const existe = usuarios.some(u => u.correo === correo);
  if (existe) {
    Swal.fire("Error", "Este correo ya está registrado", "error");
    return;
  }

  // Crear usuario compatible con login.js
  const nuevoUsuario = {
    nombre,
    telefono,
    correo,
    password,
    rol: "usuario"
  };

  usuarios.push(nuevoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  Swal.fire("Registro exitoso", "Usuario creado correctamente", "success");

  formulario.reset();
});
