// ==========================
// URL API
// ==========================
const API_URL = "http://localhost:8080/auth";

// ==========================
// ELEMENTOS
// ==========================
const form = document.getElementById("loginForm");
const correoInput = document.getElementById("correo");
const passwordInput = document.getElementById("password");
const errorDiv = document.getElementById("error-message");

// ==========================
// VALIDACIONES
// ==========================
function validarCorreo() {
    const correo = correoInput.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(correo)) {
        errorDiv.textContent = "Correo inválido";
        return false;
    }
    return true;
}

function validarPassword() {
    if (passwordInput.value.trim().length < 6) {
        errorDiv.textContent = "La contraseña debe tener mínimo 6 caracteres";
        return false;
    }
    return true;
}

// ==========================
// LOGIN CON API (JWT)
// ==========================
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorDiv.textContent = "";

    if (!validarCorreo() || !validarPassword()) return;

    try {
        const response = await fetch(`${API_URL}/loginConDTO`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: correoInput.value.trim(),
                password: passwordInput.value.trim()
            })
        });

        if (!response.ok) {
            const msg = await response.text();
            errorDiv.textContent = msg;
            return;
        }

        // backend devuelve SOLO el token
        const token = await response.text();
        localStorage.setItem("jwt", token);

        Swal.fire("Bienvenido", "Login exitoso", "success").then(() => {
            window.location.href = "/home/home.html";
        });

    } catch (error) {
        console.error(error);
        errorDiv.textContent = "Error al conectar con el servidor";
    }
});

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("jwt");
        window.location.href = "/login/login.html";
    });
}

//🛡️ PROTEGER PÁGINAS (MUY IMPORTANTE)
const token = localStorage.getItem("jwt");

if (!token) {
    window.location.href = "/login/login.html";
}






const data = await response.json();
localStorage.setItem("jwt", data.token);
localStorage.setItem("rol", data.rol);


if (data.rol === "ADMIN") {
    window.location.href = "/CRUDAdmin/main.html";
} else {
    window.location.href = "/home/home.html";
}
