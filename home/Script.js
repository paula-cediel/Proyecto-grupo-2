// Productos de ejemplo
const productos = [
    { id: 1, nombre: "Luffy", precio: 80000, img: "imagenes/lufy.png" },
    { id: 2, nombre: "Cosplay", precio: 120000, img: "imagenes/Cosplay.png" },
    { id: 3, nombre: "Zorro Hada", precio: 150000, img: "imagenes/Zorro.png" },
    { id: 4, nombre: "Anime outfits", precio: 200000, img: "imagenes/gotica.png" },
    { id: 5, nombre: "Katana", precio: 80000, img: "imagenes/KATANA.jpg" },
    { id: 6, nombre: "Lentes", precio: 120000, img: "imagenes/lentes.jpeg" },
    { id: 7, nombre: "Peluca Kira", precio: 150000, img: "imagenes/peluca kira.jpg" },
    { id: 8, nombre: "Lentes", precio: 200000, img: "imagenes/lentes2.jpeg" },
    { id: 9, nombre: "Curly Hair", precio: 80000, img: "imagenes/dandan.png" },
    { id: 10, nombre: "Choker", precio: 120000, img: "imagenes/choker.png" },
    { id: 11, nombre: "Adults Nezuko Kamado", precio: 150000, img: "imagenes/kimesu.png" },
    { id: 12, nombre: "Adult Tomioka Giyuu", precio: 200000, img: "imagenes/kimesu1.png" },
    { id: 13, nombre: "Dandadan Okarun", precio: 80000, img: "imagenes/Dandadan.png" },
    { id: 14, nombre: "Oshi no Ko Hoshino", precio: 120000, img: "imagenes/Oshi.png" },
    { id: 15, nombre: "Star Wars", precio: 150000, img: "imagenes/Star.png" },
    { id: 16, nombre: "Takerlama X-Men 97", precio: 200000, img: "imagenes/Takerlama.png" }
];

// Renderizar productos
document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-carrusel");

    let html = "";
    let contador = 0;

    productos.forEach((prod, index) => {
        if (contador === 0) {
            html += `
            <div class="carousel-item ${index === 0 ? "active" : ""}">
                <div class="row">`;
        }

        html += `
<div class="col-md-3">
    <a href="/Productos/productos.html" class="text-decoration-none text-dark d-block h-100">
        <div class="card h-100">
            <img src="${prod.img}" class="card-img-top" alt="${prod.nombre}">
            <div class="card-body text-center">
                <h5>${prod.nombre}</h5>
                <p>$${prod.precio}</p>
            </div>
        </div>
    </a>
</div>`;

        contador++;

        if (contador === 4) {
            html += `</div></div>`;
            contador = 0;
        }
    });

    if (contador !== 0) {
        html += `</div></div>`;
    }

    contenedor.innerHTML = html;
});

const seleccionados = document.getElementById('seleccionados');

// Espera a que los productos de tu compañero existan

document.addEventListener('click', (e) => {
    if (e.target.closest('.productos')) {
        const prod = e.target.closest('.productos');

        // Marcar el producto original
        prod.classList.add('seleccionado');

        // Clonar producto seleccionado
        const copia = prod.cloneNode(true);
        copia.classList.remove('seleccionado');

        // Enviar a la sección de seleccionados
        seleccionados.appendChild(copia);
    }
});

//Calificaciones a la tienda

document.addEventListener("DOMContentLoaded", () => {
    let rating = 0;

    const publicarBtn = document.getElementById("publicar");
    const ultimasDiv = document.getElementById("ultimas-calificaciones");

    // Traer calificaciones del localStorage
    let ultimasCalificaciones = JSON.parse(localStorage.getItem("ultimasCalificaciones")) || [];

    // Función para renderizar las últimas calificaciones
    const renderCalificaciones = () => {
        ultimasDiv.innerHTML = "";
        ultimasCalificaciones.forEach(c => {
            const item = document.createElement("div");
            item.className = "calificacion-item";
            item.innerHTML = `<strong>${c.nombre}:</strong> ${c.estrellas}<br>${c.desc}`;
            ultimasDiv.appendChild(item);
        });
    };

    //Llamar a la función para que traiga las calificaciones y las muestre
    renderCalificaciones();

    // Control de estrellas
    document.querySelectorAll(".star").forEach(s => {
        s.addEventListener("click", () => {
            rating = s.dataset.v;
            document.querySelectorAll(".star").forEach(x => {
                x.classList.toggle("active", x.dataset.v <= rating);
            });
        });
    });

    // Publicar nueva calificación
    publicarBtn.addEventListener("click", () => {
        const nombre = document.getElementById("name").value.trim();
        const desc = document.getElementById("desc").value.trim();

        if (!nombre || !desc || rating === 0) {
            alert("Por favor ingresa nombre, descripción y selecciona una calificación");
            return;
        }

        const estrellasTexto = "★".repeat(rating) + "☆".repeat(5 - rating);

        // Crear objeto de calificación
        const nuevaCalificacion = { nombre, desc, estrellas: estrellasTexto };

        // Agregar al inicio y limitar a 3
        ultimasCalificaciones.unshift(nuevaCalificacion);
        if (ultimasCalificaciones.length > 3) ultimasCalificaciones.pop();

        // Guardar en localStorage
        localStorage.setItem("ultimasCalificaciones", JSON.stringify(ultimasCalificaciones));

        // Renderizar
        renderCalificaciones();

        // Reset formulario
        document.getElementById("name").value = "";
        document.getElementById("desc").value = "";
        rating = 0;
        document.querySelectorAll(".star").forEach(s => s.classList.remove("active"));
    });
});



