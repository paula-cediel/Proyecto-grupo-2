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
                            <li class="nav-item"><a class="nav-link" href="../home/home.html">Inicio</a></li>
                            <li class="nav-item"><a class="nav-link" href="../acerca_de_nosotros/about.html">Sobre
                                    nosotros</a></li>
                            <li class="nav-item" id="navProductos"><a class="nav-link" href="/Productos/productos.html">Productos</a></li>
                            <li class="nav-item" id="navPerfil"><a class="nav-link" href="../CRUDAdmin/main.html">Perfil</a></li>
                            <li class="nav-item"id="navContactenos"><a class="nav-link" href="../contactenos/contact-us.html">Contáctenos</a></li>
                            <span class="nav-link text-white">Hola, Administrador</span>
                            <li class="nav-item d-flex align-items-center ms-2"></li><button id="btn_cerrar_sesion";"> Cerrar sesión </button></li>
                        </ul>
                    </div>
                </nav>
 
 
            </div>
        </header>
       
        <div class="container py-4">
            <h1 id="tituloFrom" class="text-center mb-4">Gestión de Productos</h1>
 
            <div class="card mb-4 shadow">
                <div id="tituloForm" class="card-header bg-primary text-white fw-bold ">
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
 
        /* ===== LISTAR PRODUCTOS ===== */
        async function cargarProductos() {
            const res = await fetch(API_PRODUCTOS, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const productos = await res.json();
            mostrarProductos(productos);
        }
 
        /* ===== MOSTRAR ===== */
        function mostrarProductos(productos) {
            feed.innerHTML = "";
            productos.forEach(p => {
                const div = document.createElement("div");
                div.className = "col-md-4";
                div.innerHTML = `
                <div class="card h-100 shadow">
                    <img src="${p.imagen}" class="card-img-top">
                    <div class="card-body">
                        <h5>${p.nombre}</h5>
                        <p>${p.descripcion}</p>
                        <p><b>$${p.precio_compra}</b></p>
                        <p>Stock: ${p.stock}</p>
                        <button class="btn btn-warning btn-sm editar">Editar</button>
                        <button class="btn btn-danger btn-sm eliminar">Eliminar</button>
                    </div>
                </div>`;
 
                /* ELIMINAR */
                div.querySelector(".eliminar").onclick = async () => {
                    await fetch(`${API_PRODUCTOS}/${p.idProducto}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    cargarProductos();
                };
 
                /* EDITAR */
                div.querySelector(".editar").onclick = async () => {
                    const actualizado = {
                        nombre: prompt("Nombre", p.nombre),
                        precio_compra: Number(prompt("Precio", p.precio)),
                        descripcion: prompt("Descripción", p.descripcion),
                        stock: Number(prompt("Stock", p.stock)),
                        imagen: p.imagen
                    };
 
                    await fetch(`${API_PRODUCTOS}/${p.idProducto}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(actualizado)
                    });
 
                    cargarProductos();
                };
 
                feed.appendChild(div);
            });
        }
 
        /* ===== CREAR ===== */
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
 
            const producto = {
                nombre: nombre.value,
                precio_compra: Number(precio.value),
                descripcion: descripcion.value,
                stock: Number(stock.value),
                imagen: imagen.value
            };
 
            await fetch(`${API_PRODUCTOS}/crear`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(producto)
            });
 
            form.reset();
            cargarProductos();
        });
 
        cargarProductos();

        // VISTA CLIENTE
    } else {
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
                        <dt>Contraseña</dt>
                        <dd id="password_perfil"></dd>
    
                    </dl>
                    <button class="btn primary editar_usuario">Editar</button>
                    <button id="btn_eliminar_cuenta" class="btn primary cerrar_cuenta">Cerrar cuenta</button>
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

            <section class="opinion">
                <h1>Tu calificación</h1>
                <div id="resumenCalificacion">
                    <div id="opinionItems">
                        <p class="vacio">Aún no has publicado ninguna calificación.</p>
                    </div>
                    
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

        // Función cargar perfil
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

        // Función cargar calificación
        async function cargarCalificacion() {
            try {
                const res = await fetch(`${API_USUARIOS}/${userId}/calificaciones`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const calificaciones = await res.json();
                const contenedor = document.getElementById("opinionItems");

                contenedor.innerHTML = "";

                if (!calificaciones.length) {
                    contenedor.innerHTML =
                        `<p class="vacio">Aún no has publicado ninguna calificación.</p>`;
                    return;
                }

                calificacion_realizada = true;

                const c = calificaciones[0];

                contenedor.innerHTML = `
                    <div class="opinion-card">
                        <h4>${c.nombre}</h4>
                        <p>${"★".repeat(c.estrellas)}${"☆".repeat(5 - c.estrellas)}</p>
                        <p>${c.descripcion}</p>
                    </div>
                `;
                                
            } catch (e) {
                console.error("Error cargando calificación", e);
            }
        }

        await cargarPerfil();
        await cargarCalificacion();


        // Lógica de estrellas
        const stars = document.querySelectorAll(".star");
        stars.forEach(star => {
            star.addEventListener("click", () => {
                rating = parseInt(star.dataset.v);
                stars.forEach(s => s.style.color = s.dataset.v <= rating ? "#ffc107" : "#ccc");
            });
        });

        //Función enviar calificación
        document.getElementById("publicar").addEventListener("click", async () => {

            if (calificacion_realizada) {
                return Swal.fire("Aviso","Ya ingresaste tu calificación","info");
    }
            const desc = document.getElementById("desc").value;
            if (!desc || rating === 0) return Swal.fire("Aviso", "Faltan datos", "warning");

            try {
                await fetch(`${API_USUARIOS}/${userId}/calificaciones`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify({ nombre: usuarioActual.nombre, descripcion: desc, estrellas: rating })
                });
                Swal.fire("¡Gracias!", "Calificación guardada", "success");
                calificacion_realizada = true;
                await cargarCalificacion();
            } catch (e) { Swal.fire("Error", "No se pudo enviar", "error"); }
        });

        // Botón Editar
        document.querySelector(".editar_usuario").onclick = async () => {
             const { value: formValues } = await Swal.fire({
                title: 'Editar Perfil',
                html: 
//EDITAR JHOANA
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

        // Funció´eliminar usuario - cerrar cuenta
        const btnEliminar = document.getElementById("btn_eliminar_cuenta");
        if (btnEliminar) {
            btnEliminar.onclick = async () => {
                const result = await Swal.fire({
                    title: '¿Estás completamente seguro?',
                    text: "Tu cuenta será eliminada permanentemente y no podrás recuperarla.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, eliminar cuenta',
                    cancelButtonText: 'Cancelar'
                });

                if (result.isConfirmed) {
                    try {
                        const response = await fetch(`${API_USUARIOS}/${userId}`, {
                            method: "DELETE",
                            headers: { 
                                "Authorization": `Bearer ${token}` 
                            }
                        });

                        if (response.ok) {
                            await Swal.fire('Cuenta Eliminada', 'Tu cuenta ha sido borrada con éxito.', 'success');
                            localStorage.clear();
                            window.location.href = "/home/home.html"; 
                        } else {
                            const errorData = await response.json();
                            Swal.fire('Error', errorData.message || 'No se pudo eliminar la cuenta.', 'error');
                        }
                    } catch (error) {
                        console.error("Error al eliminar cuenta:", error);
                        Swal.fire('Error', 'Hubo un fallo de conexión con el servidor.', 'error');
                    }
                }
            };
        }
    }

    // Evento cerrar sesión (común para ambos)
    document.getElementById("btn_cerrar_sesion").onclick = () => {
        localStorage.clear();
        window.location.href = "/loginSpring/login.html";
    };
}); 
