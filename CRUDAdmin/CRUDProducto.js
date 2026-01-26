document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById("contenido_perfil");
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
    const token = localStorage.getItem("token");
    
    // Configuración de APIs
    const API_PRODUCTOS = "http://localhost:8081/productos";
    const API_USUARIOS = "http://localhost:8081/usuarios"; 
    const userId = usuario?.id;
    let rating = 0;

    // Validación de sesión
    if (!token || !usuario) {
        window.location.href = "/loginSpring/login.html";
        return;
    }

    if (usuario.rol === "ADMIN") {
        /* ======================================================
           ===============   ADMINISTRADOR   ====================
           ====================================================== */
        contenedor.innerHTML = `
        <header class="header-nav">
            <div class="container-fluid">
                <nav class="navbar navbar-expand-lg navbar-dark bg-dark-purple shadow-sm">
                    <div class="top-bar d-flex justify-content-between align-items-center">
                        <a class="navbar-brand d-flex justify-content-start" href="#">
                            <img src="images/LogoLetra.png" alt="Letal Cosplay Logo" class="logo-navbar">
                        </a>
                    </div>

                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse justify-content-center" id="navMenu">
                        <ul class="nav-links text-center mt-3 navbar-nav ms-auto ">
                            <li class="nav-item"><a class="nav-link" href="/home/home.html">Inicio</a></li>
                            <li class="nav-item"><a class="nav-link" href="/acerca_de_nosotros/about.html">Sobre
                                    nosotros</a></li>
                            <li class="nav-item" id="navProductos"><a class="nav-link" href="/Productos/productos.html">Productos</a></li>
                            <li class="nav-item" id="navPerfil"><a class="nav-link" href="/CRUDAdmin/main.html">Perfil</a></li>
                            <li class="nav-item"id="navContactenos"><a class="nav-link" href="/contactenos/contact-us.html">Contáctenos</a></li>
                            <span class="nav-link text-white">Hola, Administrador</span>
                            <li class="nav-item d-flex align-items-center ms-2"></li><button id="btn_cerrar_sesion";"> Cerrar sesión </button></li>
                        </ul>
                    </div>
                </nav>


            </div>
        </header>
        
        <div class="container py-4">
            <h1 class="text-center mb-4">Gestión de Productos</h1>

            <div class="card mb-4 shadow">
                <div class="card-header bg-primary text-white fw-bold">
                    Crear producto
                </div>
                <div class="card-body">
                    <form id="productoForm">
                        <input class="form-control mb-2" id="nombre" placeholder="Nombre" required>
                        <input class="form-control mb-2" id="precio" type="number" placeholder="Precio" required>
                        <textarea class="form-control mb-2" id="descripcion" placeholder="Descripción" required></textarea>
                        <input class="form-control mb-2" id="stock" type="number" placeholder="Stock" required>
                        <input class="form-control mb-2" id="imagen" placeholder="URL Imagen" required>
                        <button class="btn btn-success w-100">Guardar</button>
                    </form>
                </div>
            </div>

            <h3>Productos publicados</h3>
            <div id="feed" class="row g-3"></div>
        </div>`;

        const form = document.getElementById("productoForm");
        const feed = document.getElementById("feed");

        async function cargarProductos() {
            try {
                const res = await fetch(API_PRODUCTOS, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const productos = await res.json();
                mostrarProductos(productos);
            } catch (e) { console.error("Error cargando productos", e); }
        }

        function mostrarProductos(productos) {
            feed.innerHTML = "";
            productos.forEach(p => {
                const div = document.createElement("div");
                div.className = "col-md-4";
                div.innerHTML = `
                <div class="card h-100 shadow">
                    <img src="${p.imagen}" class="card-img-top" style="height:200px; object-fit:cover;">
                    <div class="card-body">
                        <h5>${p.nombre}</h5>
                        <p class="small text-muted">${p.descripcion}</p>
                        <p><b>$${p.precio_compra}</b> | Stock: ${p.stock}</p>
                        <button class="btn btn-danger btn-sm eliminar">Eliminar</button>
                    </div>
                </div>`;
                div.querySelector(".eliminar").onclick = async () => {
                    if(confirm("¿Eliminar producto?")) {
                        await fetch(`${API_PRODUCTOS}/${p.idProducto}`, {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        cargarProductos();
                    }
                };
                feed.appendChild(div);
            });
        }

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nuevoP = {
                nombre: document.getElementById("nombre").value,
                precio_compra: Number(document.getElementById("precio").value),
                descripcion: document.getElementById("descripcion").value,
                stock: Number(document.getElementById("stock").value),
                imagen: document.getElementById("imagen").value
            };
            await fetch(`${API_PRODUCTOS}/crear`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(nuevoP)
            });
            form.reset();
            cargarProductos();
        });

        cargarProductos();

    } else {
        /* ======================================================
           ==================   CLIENTE   =======================
           ====================================================== */
        contenedor.innerHTML = `
        <header class="header-nav">
            <div class="container-fluid">
                <nav class="navbar navbar-expand-lg navbar-dark bg-dark-purple shadow-sm">
                    <div class="top-bar d-flex justify-content-between align-items-center">
                        <a class="navbar-brand d-flex justify-content-start" href="#">
                            <img src="images/LogoLetra.png" alt="Letal Cosplay Logo" class="logo-navbar">
                        </a>
                    </div>

                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse justify-content-center" id="navMenu">
                        <ul class="nav-links text-center mt-3 navbar-nav ms-auto ">
                            <li class="nav-item"><a class="nav-link" href="/home/home.html">Inicio</a></li>
                            <li class="nav-item"><a class="nav-link" href="/acerca_de_nosotros/about.html">Sobre nosotros</a></li>
                            <li class="nav-item" id="navProductos"><a class="nav-link" href="/Productos/productos.html">Productos</a></li>
                            <li class="nav-item" id="navPerfil"><a class="nav-link" href="/CRUDAdmin/main.html">Perfil</a></li>
                            <li class="nav-item" id="navContactenos"><a class="nav-link" href="/contactenos/contact-us.html">Contáctenos</a></li>
                            <li class="nav-item d-flex align-items-center ms-2"><span id="saludo"></span></li>
                            <li class="nav-item d-flex align-items-center ms-2"><button id="btn_cerrar_sesion"> Cerrar sesión </button></li>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>

        <main class="perfil-grid">
            <section class="perfil">
                <header class="header_perfil">
                    <h1>Mis datos</h1>
                </header>

                <article class="info_perfil">
                    <dl>
                        <dt>Nombre</dt>
                        <dd id="nombre_perfil"></dd>
                        <dt>Apellido</dt>
                        <dd id="apellido_perfil"></dd>
                        <dt>Telefono</dt>
                        <dd id="telefono_perfil"></dd>
                        <dt>Correo</dt>
                        <dd id="correo_perfil"></dd>
                        <dt>Dirección</dt>
                        <dd id="direccion_perfil"></dd>
                        <dt>Password</dt>
                        <dd id="password_perfil"></dd>
    
                    </dl>
                    <button class="btn primary editar_usuario">Editar</button>
                </article>
            </section>

            <section class="califica-tienda">
                <h1>Califica la tienda</h1>
                <div class="form-opinion">
                    <form id="formCalifica">
                        <label for="name">Nombre</label>
                        <input type="text" id="name" placeholder="Tu nombre" required>
                        
                        <label for="desc">Tu opinión</label>
                        <textarea id="desc" placeholder="Escribe aquí tu comentario..." rows="3"></textarea>

                        <div class="rating-container">
                            <span>Puntuación:</span>
                            <div class="stars">
                                <span class="star" data-v="1">★</span>
                                <span class="star" data-v="2">★</span>
                                <span class="star" data-v="3">★</span>
                                <span class="star" data-v="4">★</span>
                                <span class="star" data-v="5">★</span>
                            </div>
                        </div>

                        <button type="button" id="publicar" class="btn primary">Publicar</button>
                    </form>
                </div>
            </section>
        </main>

        <footer class="mt-auto">
            <div>
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <h5 class="text-uppercase">Letal cosplay</h5>
                        <p>Letal Cosplay ofrece productos de alta calidad a precios accesibles, con opciones personalizadas y acabados profesionales que se adaptan a cada cliente.</p>
                    </div>

                    <div class="col-md-4 mb-3">
                        <h5 class="text-uppercase">Secciones</h5>
                        <ul class="list-unstyled">
                            <li><a href="#productos-destacados">Inicio</a></li>
                            <li><a href="#Productos">Productos</a></li>
                            <li><a href="#QuienesSomos">Quienes Somos</a></li>
                            <li><a href="#Contactenos">Contactenos</a></li>
                        </ul>
                    </div>

                    <div class="col-md-4 mb-3">
                        <h5 class="text-uppercase">Síguenos</h5>
                        <ul class="list-inline">
                            <li class="list-inline-item"><a href="https://www.facebook.com/profile.php?id=61579635025362"><i class="bi bi-facebook"></i></a></li>
                            <li class="list-inline-item"><a href="#"><i class="bi bi-twitter"></i></a></li>
                            <li class="list-inline-item"><a href="https://www.instagram.com/letalcosplay/"><i class="bi bi-instagram"></i></a></li>
                        </ul>
                    </div>
                </div>

                <hr class="mb-4">
                <p>&copy; 2025 Letal Cosplay, todos los derechos reservados.</p>
            </div>
        </footer>
        `;

        let usuarioActual = null;

        async function cargarPerfil() {
            try {
                const res = await fetch(`${API_USUARIOS}/${userId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                usuarioActual = await res.json();
                document.getElementById("nombre_perfil").textContent = usuarioActual.nombre;
                document.getElementById("apellido_perfil").textContent = usuarioActual.apellido || "No asignado";
                document.getElementById("telefono_perfil").textContent = usuarioActual.telefono;
                document.getElementById("correo_perfil").textContent = usuarioActual.correo;
                document.getElementById("direccion_perfil").textContent =usuarioActual.direccion || "No asignado";
                document.getElementById("password_perfil").textContent = "********";
                document.getElementById("saludo").textContent = `Hola, ${usuarioActual.nombre}`;
            } catch (err) { console.error(err); }
        }

        await cargarPerfil();

        // Lógica de estrellas
        const stars = document.querySelectorAll(".star");
        stars.forEach(star => {
            star.addEventListener("click", () => {
                rating = parseInt(star.dataset.v);
                stars.forEach(s => s.style.color = s.dataset.v <= rating ? "#ffc107" : "#ccc");
            });
        });

        // Publicar calificación
        document.getElementById("publicar").addEventListener("click", async () => {
            const desc = document.getElementById("desc").value;
            if (!desc || rating === 0) return Swal.fire("Aviso", "Faltan datos", "warning");

            try {
                await fetch(`${API_USUARIOS}/${userId}/calificaciones`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify({ nombre: usuarioActual.nombre, descripcion: desc, estrellas: rating })
                });
                Swal.fire("¡Gracias!", "Calificación guardada", "success");
            } catch (e) { Swal.fire("Error", "No se pudo enviar", "error"); }
        });

        // Botón Editar
        document.querySelector(".editar_usuario").onclick = async () => {
             const { value: formValues } = await Swal.fire({
                title: 'Editar Perfil',
                html: 
                    `<label class="swal-label">Nombre</label>`+
                    `<input id="sw-nom" class="swal2-input" value="${usuarioActual.nombre}">` +
                    `<label class="swal-label">Apellido</label>`+
                    `<input id="sw-ape" class="swal2-input" value="${usuarioActual.apellido || ''}">`+
                    `<label class="swal-label">Teléfono</label>`+
                    `<input id="sw-tel" class="swal2-input" value="${usuarioActual.telefono || ''}">`+
                    `<label class="swal-label">Dirección</label>`+
                    `<input id="sw-dir" class="swal2-input" value="${usuarioActual.direccion || ''}">`+
                    `<label class="swal-label">Contraseña</label>`+
                    `<input id="sw-pass" class="swal2-input" value=" ">`,

                preConfirm: () => ({
                    nombre: document.getElementById('sw-nom').value,
                    apellido: document.getElementById('sw-ape').value,
                    telefono: document.getElementById('sw-tel').value,
                    direccion: document.getElementById('sw-dir').value,
                    password: document.getElementById('sw-pass').value
                })
            });
            if (formValues) {
                await fetch(`${API_USUARIOS}/${userId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify({ ...usuarioActual, ...formValues })
                });
                cargarPerfil();
            }
        };
    }

    // Evento cerrar sesión (común para ambos)
    document.getElementById("btn_cerrar_sesion").onclick = () => {
        localStorage.clear();
        window.location.href = "/loginSpring/login.html";
    };
}); 
