document.addEventListener("DOMContentLoaded", () => {

    const heroBtn = document.querySelector(".hero-btn");
        
    heroBtn.addEventListener("click", () => {
        window.location.href = "../Productos/productos.html";
    });
    

    /* ================= PRODUCTOS ================= */

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

    const contenedor = document.getElementById("contenedor-carrusel");

    if (contenedor) {
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

        if (contador !== 0) html += `</div></div>`;

        contenedor.innerHTML = html;
    }

    /* ================= CALIFICACIONES ================= */

    const ultimasDiv = document.getElementById("ultimas-calificaciones");
    const API_URL = "http://localhost:8081/calificaciones";

    if (ultimasDiv) {

        const estrellasTexto = (rating) =>
            "★".repeat(rating) + "☆".repeat(5 - rating);

        const renderCalificaciones = (calificaciones) => {
            ultimasDiv.innerHTML = "";

            calificaciones
                .sort((a, b) => b.id - a.id)
                .slice(0, 3)
                .forEach(c => {
                    const col = document.createElement("div");
                    col.className = "col-md-4 d-flex justify-content-center";

                    col.innerHTML = `
                        <div class="calificacion-card">
                            <h5>${c.nombre}</h5>
                            <div class="calificacion-estrellas">
                                ${estrellasTexto(c.estrellas)}
                            </div>
                            <p class="calificacion-texto">
                                ${c.descripcion}
                            </p>
                        </div>
                    `;

                    ultimasDiv.appendChild(col);
                });
        };

        const cargarCalificaciones = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error("Error al cargar calificaciones");

                const data = await response.json();
                renderCalificaciones(data);

            } catch (error) {
                console.error(error);
                ultimasDiv.innerHTML = `
                    <p class="text-center text-danger">
                        No se pudieron cargar las calificaciones
                    </p>
                `;
            }
        };

        cargarCalificaciones();
    }
});
