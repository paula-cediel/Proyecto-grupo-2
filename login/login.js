const form = document.getElementById("loginForm");
const correoInput = document.getElementById("correo");
const passwordInput = document.getElementById("password");

// ==========================
// ADMIN PRECREADO
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

// ==========================
// VALIDACIONES EN TIEMPO REAL
// ==========================
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

const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

if (usuarioActivo) {
    logoutBtn.classList.remove("d-none");
}

// ==========================
// LOGIN
// ==========================
form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validarCorreo() || !validarPassword()) return;

    const correo = correoInput.value.trim();
    const password = passwordInput.value.trim();

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuario = usuarios.find(
        u => u.correo === correo && u.password === password
    );

    if (!usuario) {
        alert("Usuario no registrado o contraseña incorrecta");
        return;
    }

    // Guardar sesión
    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));

    // Redirecciones
    if (usuario.rol === "admin") {
        window.location.href = "/CRUDAdmin/main.html";
    } else {
        window.location.href = "/home/home.html";
    }
});

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("usuarioActivo");
        window.location.href = "/login/login.html";
    });
}


