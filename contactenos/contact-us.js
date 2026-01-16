    const form = document.getElementById("formContacto");

    // Permitir solo letras en nombre
    document.getElementById("nombre").addEventListener("input", function () {
        this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    });

    // Solo números en celular
    document.getElementById("celular").addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, "");
    });

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        let valido = true;

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const celular = document.getElementById("celular").value.trim();
        const tipo = document.getElementById("tipoSolicitud").value;
        const mensaje = document.getElementById("mensaje").value.trim();

        // Limpiar errores
        document.getElementById("errorNombre").textContent = "";
        document.getElementById("errorCorreo").textContent = "";
        document.getElementById("errorCelular").textContent = "";
        document.getElementById("errorTipo").textContent = "";
        document.getElementById("errorMensaje").textContent = "";

        // Validar nombre
        if (nombre.length < 3) {
            document.getElementById("errorNombre").textContent = "El nombre debe tener mínimo 3 caracteres.";
            valido = false;
        }

        // Validar correo
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(correo)) {
            document.getElementById("errorCorreo").textContent = "Correo inválido.";
            valido = false;
        }

        // Validar celular
        if (celular.length !== 10) {
            document.getElementById("errorCelular").textContent = "El celular debe tener exactamente 10 dígitos.";
            valido = false;
        }

        // Validar select
        if (tipo === "") {
            document.getElementById("errorTipo").textContent = "Selecciona una opción.";
            valido = false;
        }

        // Validar mensaje
        if (mensaje.length < 10) {
            document.getElementById("errorMensaje").textContent = "El mensaje debe tener mínimo 10 caracteres.";
            valido = false;
        }

        // SI NO ES VÁLIDO → no enviar
        if (!valido) return;

        // ====== ENVÍO A FORMASPRE ======
        // const urlFormspree = "seanadrianvc@gmail.com"; 

        // const formData = {
        //     nombre,
        //     correo,
        //     celular,
        //     tipoSolicitud: tipo,
        //     mensaje
        // };

        // try {
        //     const response = await fetch(urlFormspree, {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify(formData)
        //     });

        //     if (response.ok) {
        //         alert("Formulario enviado correctamente ✔");
        //         form.reset();
        //     } else {
        //         alert("Error al enviar el formulario.");
        //     }
        // } catch (error) {
        //     alert("No se pudo conectar con el servidor.");
        // }

        // SI NO ES VÁLIDO → no enviar
        if (!valido){
            return;
        } 

        Swal.fire("Envío exitoso", "Información enviada correctamente", "success");

        // Guardar en el localstorage
        const contacto = {
            nombre,
            correo,
            celular,
            tipoSolicitud: tipo,
            mensaje,
            fecha: new Date().toISOString()
        };

        const contactosGuardados = JSON.parse(localStorage.getItem("contactos")) || [];
        contactosGuardados.push(contacto);
        localStorage.setItem("contactos", JSON.stringify(contactosGuardados));

    });



