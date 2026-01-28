const form = document.getElementById("login-form");
const correoInput = document.getElementById("correo");
const passwordInput = document.getElementById("password");
const logoutBtn = document.getElementById("logoutBtn");

const errorCorreo = document.getElementById("errorCorreo");
const errorPassword = document.getElementById("errorPassword");


// VALIDACIONES EN TIEMPO REAL
correoInput.addEventListener("input", validarCorreo);
passwordInput.addEventListener("input", validarPassword);

function validarCorreo() {
    const correo = correoInput.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (correo === "") {
        errorCorreo.textContent = "El correo es obligatorio";
        return false;
    } else if (!regex.test(correo)) {
        errorCorreo.textContent = "Correo inválido";
        return false;
    } else {
        errorCorreo.textContent = "";
        return true;
    }
}

function validarPassword() {
    const pass = passwordInput.value.trim();

    if (pass.length < 6) {
        errorPassword.textContent = "Mínimo 6 caracteres";
        return false;
    } else {
        errorPassword.textContent = "";
        return true;
    }
}


// MOSTRAR / OCULTAR PASSWORD
let mostrar = false;
const password = document.getElementById("password");
const ojito = document.getElementById("ojito");

ojito.addEventListener("click", () => {
    if (mostrar) {
        password.type = "password";
        ojito.src = "../images/ojo_abierto.png";
        mostrar = false;
    } else {
        password.type = "text";
        ojito.src = "../images/ojo_cerrado.png";
        mostrar = true;
    }
});

//Quitar las alertas en tiempo real
correoInput.addEventListener("blur", () => {
    errorCorreo.textContent = "";
});

passwordInput.addEventListener("blur", () => {
    errorPassword.textContent = "";
});


// LOGIN CON BACKEND

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validarCorreo() || !validarPassword()) return;

    const loginDTO = {
        correo: correoInput.value.trim(),
        password: passwordInput.value.trim()
    };

    try {
        const response = await fetch("http://localhost:8081/auth/loginConDTO", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginDTO)
        });

        if (!response.ok) {
            throw new Error("Credenciales inválidas");
        }

        const data = await response.json();
        
        // GUARDAR TOKEN Y USUARIO
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuarioActivo", JSON.stringify({
            correo: data.correo,
            rol: data.rol,
            nombre:data.nombre,
            id: data.id


        }));

        Swal.fire({
            title: "Bienvenido",
            text: "Ingreso exitoso",
            icon: "success",
            confirmButtonText: "Continuar"
        }).then(() => {

            // REDIRECCIONES POR ROL
            if (data.rol === "ADMIN") {
                window.location.href = "../CRUDAdmin/main.html";
            } else {
                window.location.href = "../home/home.html";
            }
        });

    } catch (error) {
        let titulo = "Error de inicio de sesión";
        let mensaje = error.message;

        if (error.message === "Failed to fetch" || error.name === "TypeError") {
            titulo = "Servidor fuera de servicio";
            mensaje = "Por favor intenta mas tarde.";
        }

        Swal.fire({
            icon: 'error',
            title: titulo,
            text: mensaje,
            confirmButtonColor: '#591c32',
            confirmButtonText: 'Entendido'
        });
        
        console.error("Error detallado:", error);
    }
});

// LOGOUT
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuarioActivo");
        window.location.href = "/login/login.html";
    });
}
