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

//Quitar las alertas tiempo real
nombreInput.addEventListener("blur", () => {
    errorNombre.textContent = "";
});
correoInput.addEventListener("blur", () => {
    errorCorreo.textContent = "";
});
celularInput.addEventListener("blur", () => {
    errorCelular.textContent = "";
});
mensajeInput.addEventListener("blur", () => {
    errorMensaje.textContent = "";
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

  const contacto = {
    nombre: nombreInput.value.trim(),
    correo: correoInput.value.trim(),
    telefono: celularInput.value.trim(),
    tipoSolicitud: tipoInput.value,
    mensaje: mensajeInput.value.trim(),
    fecha: new Date().toISOString()
  };

  try{
    const response = await fetch("http://localhost:8081/contactos/crear",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contacto)
    });
    if(!response.ok){
      throw new Error("No se puedo enviar la información")
    }
    const data = await response.json();
  Swal.fire({
            title: "Envío exitoso",
            text: "Pronto te contactaremos",
            icon: "success",
            confirmButtonText: "Continuar"
        }).then(() => {
          form.reset()
        });
  } catch (error){
    let titulo = "Error al enviar información";
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
  

  // const contactosGuardados = JSON.parse(localStorage.getItem("contactos")) || [];
  // contactosGuardados.push(contacto);
  // localStorage.setItem("contactos", JSON.stringify(contactosGuardados));

  form.reset();
});
