const form = document.getElementById("formContacto");

const nombreInput = document.getElementById("nombre");
const correoInput = document.getElementById("correo");
const celularInput = document.getElementById("celular");
const tipoInput = document.getElementById("tipoSolicitud");
const mensajeInput = document.getElementById("mensaje");

const errorNombre = document.getElementById("errorNombre");
const errorCorreo = document.getElementById("errorCorreo");
const errorCelular = document.getElementById("errorCelular");
const errorTipo = document.getElementById("errorTipo");
const errorMensaje = document.getElementById("errorMensaje");

nombreInput.addEventListener("input", function () {
  this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
  errorNombre.textContent =
    this.value.trim().length < 3 ? "El nombre debe tener mínimo 3 caracteres." : "";
});

celularInput.addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, "");
  errorCelular.textContent =
    this.value.length !== 10 ? "El celular debe tener exactamente 10 dígitos." : "";
});

correoInput.addEventListener("input", () => {
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  errorCorreo.textContent =
    !regexCorreo.test(correoInput.value.trim()) ? "Correo inválido." : "";
});

tipoInput.addEventListener("change", () => {
  errorTipo.textContent = tipoInput.value === "" ? "Selecciona una opción." : "";
});

mensajeInput.addEventListener("input", () => {
  errorMensaje.textContent =
    mensajeInput.value.trim().length < 10 ? "El mensaje debe tener mínimo 10 caracteres." : "";
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  let valido = true;

  if (nombreInput.value.trim().length < 3) {
    errorNombre.textContent = "El nombre debe tener mínimo 3 caracteres.";
    valido = false;
  }

  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexCorreo.test(correoInput.value.trim())) {
    errorCorreo.textContent = "Correo inválido.";
    valido = false;
  }

  if (celularInput.value.length !== 10) {
    errorCelular.textContent = "El celular debe tener exactamente 10 dígitos.";
    valido = false;
  }

  if (tipoInput.value === "") {
    errorTipo.textContent = "Selecciona una opción.";
    valido = false;
  }

  if (mensajeInput.value.trim().length < 10) {
    errorMensaje.textContent = "El mensaje debe tener mínimo 10 caracteres.";
    valido = false;
  }

  if (!valido) return;

  Swal.fire("Envío exitoso", "Información enviada correctamente", "success");

  const contacto = {
    nombre: nombreInput.value.trim(),
    correo: correoInput.value.trim(),
    celular: celularInput.value.trim(),
    tipoSolicitud: tipoInput.value,
    mensaje: mensajeInput.value.trim(),
    fecha: new Date().toISOString()
  };

  const contactosGuardados = JSON.parse(localStorage.getItem("contactos")) || [];
  contactosGuardados.push(contacto);
  localStorage.setItem("contactos", JSON.stringify(contactosGuardados));

  form.reset();
});
