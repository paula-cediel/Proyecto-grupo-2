// ==========================
// MOSTRAR / OCULTAR CONTRASEÑA
// ==========================
let mostrar = false;
const contrasena = document.getElementById("contrasena");
const ojito = document.getElementById("ojito");

ojito.addEventListener("click", () => {
    if (mostrar) {
        contrasena.type = "password";
        ojito.src = "/images/ojo_abierto.png";
        mostrar = false;
    } else {
        contrasena.type = "text";
        ojito.src = "/images/ojo_cerrado.png";
        mostrar = true;
    }
});

// ==========================
// VALIDACIONES EN TIEMPO REAL
// ==========================
const minusculas = "abcdefghijklmnopqrstuvwxyz".split("");
const mayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const numeros = "0123456789".split("");
const simbolos = "@$!%*?&#._-".split("");

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

// NOMBRE
nombreInput.addEventListener("input", () => {
    if (nombreInput.value.trim() === "") errorNombre.textContent = "El nombre es obligatorio";
    else if (!isNaN(nombreInput.value)) errorNombre.textContent = "El nombre no puede ser solo números";
    else if (nombreInput.value.length < 3) errorNombre.textContent = "Debe tener al menos 3 caracteres";
    else if(nombreInput.textContent = " ") errorNombre.textContent = "No pueden haber espacios";
    else errorNombre.textContent = "";
});

// TELÉFONO
telefonoInput.addEventListener("input", () => {
    if (telefonoInput.value.trim() === "") errorTelefono.textContent = "El teléfono es obligatorio";
    else if (telefonoInput.value.includes(" ")) errorTelefono.textContent = "No debe contener espacios";
    else if (isNaN(telefonoInput.value)) errorTelefono.textContent = "Solo números";
    else if (telefonoInput.value.length !== 10) errorTelefono.textContent = "Debe tener 10 números";
    else errorTelefono.textContent = "";
});

// CORREO
correoInput.addEventListener("input", () => {
    if (correoInput.value.trim() === "") errorCorreo.textContent = "El correo es obligatorio";
    else if (!emailRegex.test(correoInput.value)) errorCorreo.textContent = "Correo no válido";
    else errorCorreo.textContent = "";
});

// CONTRASEÑA
passwordInput.addEventListener("input", () => {
    let min=false, may=false, num=false, sim=false;
    const value = passwordInput.value;

    if(value.length < 8) { errorPassword.textContent = "Mínimo 8 caracteres"; return; }

    for(let c of value){
        if(minusculas.includes(c)) min=true;
        else if(mayusculas.includes(c)) may=true;
        else if(numeros.includes(c)) num=true;
        else if(simbolos.includes(c)) sim=true;
    }

    if(!min || !may || !num || !sim) errorPassword.textContent="Debe incluir mayúscula, minúscula, número y símbolo";
    else errorPassword.textContent="";
});

// ==========================
// REGISTRO DE USUARIO 
// ==========================
formulario.onsubmit = async (e) => {
    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const correo = correoInput.value.trim();
    const password = passwordInput.value.trim();

    if (!nombre || !telefono || !correo || !password) {
        Swal.fire("Error", "Todos los campos son obligatorios", "error");
        return;
    }

    const nuevoUsuario = {
        nombre,
        telefono, 
        correo,
        password,
        rol: "CLIENTE"
    };

    try {
        const response = await fetch("http://localhost:8081/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoUsuario)
        });

        if (!response.ok) {
        let mensaje = "Error al registrar usuario";
        
        try {
            const errorData = await response.json();
            mensaje = errorData.message || errorData.error || mensaje;
        } catch (jsonError) {   
            console.error("No se pudo parsear el error del servidor", jsonError);
        }
        
        throw new Error(mensaje);
    }

        await Swal.fire("Registro exitoso", "Usuario creado correctamente", "success");
        window.location.href = "../home/home.html"; 

    } catch (error) {
        Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message
    });
    }
};
