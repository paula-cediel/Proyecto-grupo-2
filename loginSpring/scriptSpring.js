const API_URL = "http://localhost:8080/auth";

// ELEMENTOS
const form = document.getElementById("login-form");
const correoInput = document.getElementById("correo");
const passwordInput = document.getElementById("password");
const errorCorreo = document.getElementById("errorCorreo");
const errorPassword = document.getElementById("errorPassword");

// VALIDACIONES
function validarCorreo() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(correoInput.value.trim())) {
        errorCorreo.textContent = "Correo inválido";
        return false;
    }
    errorCorreo.textContent = "";
    return true;
}

function validarPassword() {
    if (passwordInput.value.trim().length < 6) {
        errorPassword.textContent = "Mínimo 6 caracteres";
        return false;
    }
    errorPassword.textContent = "";
    return true;
}

correoInput.addEventListener("input", validarCorreo);
passwordInput.addEventListener("input", validarPassword);

// LOGIN
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarCorreo() || !validarPassword()) return;

    try {
        const response = await fetch(`${API_URL}/loginConDTO`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                correo: correoInput.value.trim(),
                password: passwordInput.value.trim()
            })
        });

        if (!response.ok) {
            const msg = await response.text();
            errorPassword.textContent = msg;
            return;
        }

        // 👈 EL TOKEN VIENE COMO TEXTO
        const token = await response.text();

        localStorage.setItem("jwt", token);

        Swal.fire("Bienvenido", "Login exitoso", "success").then(() => {
            window.location.href = "../home/home.html";
        });

    } catch (error) {
        console.error(error);
        errorPassword.textContent = "Error al conectar con el servidor";
    }
});

// MOSTRAR / OCULTAR CONTRASEÑA
let mostrar = false;
const ojito = document.getElementById("ojito");

ojito.addEventListener("click", () => {
    passwordInput.type = mostrar ? "password" : "text";
    ojito.src = mostrar
        ? "/images/ojo_abierto.png"
        : "/images/ojo_cerrado.png";
    mostrar = !mostrar;
});
