document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById("contenido_perfil");
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
    const token = localStorage.getItem("token");
    const API_PRODUCTOS = "http://localhost:8081/productos";
    const API_USUARIOS = "http://localhost:8081/usuarios"; // <-- falta definir
    const userId = usuario?.id; // <-- id del usuario activo
    let rating = 0;

    if (!token) {
        alert("Sesión expirada");
        window.location.href = "/loginSpring/login.html";
        return;
    }

    /* ======================================================
       ===============   ADMINISTRADOR   ====================
       ====================================================== */
    if (usuario.rol === "ADMIN") {

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
        </div>
        `;

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
                        <p><b>$${p.precio}</b></p>
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
                        precio: Number(prompt("Precio", p.precio)),
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
                precio: Number(precio.value),
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
    }

    /* ======================================================
       ==================   CLIENTE   =======================
       ====================================================== */
    else {
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
                        <dt>Correo</dt>
                        <dd id="correo_perfil"></dd>
                        <dt>Teléfono</dt>
                        <dd id="telefono_perfil"></dd>
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

            <section class="carrito">
                <h1>Mi carrito</h1>
                <div id="productosCarrito">
                    <p class="vacio">Tu carrito está vacío</p>
                </div>
                <div class="total">
                    Total: <span id="totalCarrito">$0</span>
                </div>
                <button type="submit" class="btn success btnPagar">Pagar</button>
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

        // ================= PERFIL =================
        async function cargarPerfil() {
            try {
                const res = await fetch(`${API_USUARIOS}/${userId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!res.ok) throw new Error("No se pudo cargar el perfil");
                const user = await res.json();

                document.getElementById("nombre_perfil").textContent = user.nombre;
                document.getElementById("correo_perfil").textContent = user.correo;
                document.getElementById("telefono_perfil").textContent = user.telefono || "";
                document.getElementById("saludo").textContent = `Hola, ${user.nombre}`;

                return user;
            } catch (err) {
                console.error(err);
            }
        }

        const usuarioReal = await cargarPerfil();

        // ================= EDITAR PERFIL =================
        const btnEditar = document.querySelector(".editar_usuario");
        if (btnEditar) {
            btnEditar.addEventListener("click", async () => {
                const nuevoNombre = prompt("Nuevo nombre:", usuarioReal.nombre);
                const nuevoTelefono = prompt("Nuevo teléfono:", usuarioReal.telefono || "");
                if (!nuevoNombre || !nuevoTelefono) return;

                try {
                    const res = await fetch(`${API_USUARIOS}/${userId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ nombre: nuevoNombre, telefono: nuevoTelefono })
                    });

                    if (!res.ok) throw new Error("Error actualizando usuario");

                    const actualizado = await res.json();
                    document.getElementById("nombre_perfil").textContent = actualizado.nombre;
                    document.getElementById("telefono_perfil").textContent = actualizado.telefono || "";
                    document.getElementById("saludo").textContent = `Hola, ${actualizado.nombre}`;

                    Swal.fire("Éxito", "Perfil actualizado correctamente", "success");

                } catch (err) {
                    console.error(err);
                    Swal.fire("Error", "No se pudo actualizar el perfil", "error");
                }
            });
        }

        // ================= CALIFICACIÓN TIENDA =================
        const stars = document.querySelectorAll(".stars .star");
        stars.forEach(star => {
            star.addEventListener("click", () => {
                rating = parseInt(star.dataset.v);
                stars.forEach(s => s.classList.toggle("active", s.dataset.v <= rating));
            });
        });

        const publicarBtn = document.getElementById("publicar");
        publicarBtn.addEventListener("click", async () => {
            const nombre = document.getElementById("name").value.trim();
            const descripcion = document.getElementById("desc").value.trim();

            if (!nombre || !descripcion || rating === 0) {
                Swal.fire("Atención", "Nombre, opinión y estrellas son obligatorios", "warning");
                return;
            }

            try {
                const res = await fetch(`${API_USUARIOS}/${userId}/calificaciones`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ nombre, descripcion, estrellas: rating })
                });

                if (!res.ok) throw new Error("Error al guardar calificación");

                Swal.fire("¡Gracias!", "Calificación guardada", "success");
                document.getElementById("formCalifica").reset();
                rating = 0;
                stars.forEach(s => s.classList.remove("active"));

            } catch (err) {
                console.error(err);
                Swal.fire("Error", "No se pudo guardar la calificación", "error");
            }
        });

        // ================= CARRITO =================
        const productosCarrito = document.getElementById("productosCarrito");
        const totalCarrito = document.getElementById("totalCarrito");

        function mostrarCarrito() {
            productosCarrito.innerHTML = "";
            const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            if (carrito.length === 0) {
                productosCarrito.innerHTML = `<p class="vacio">Tu carrito está vacío</p>`;
                totalCarrito.textContent = "$0";
                return;
            }
            let total = 0;
            carrito.forEach(p => {
                const subtotal = p.precio * p.cantidad;
                total += subtotal;
                const div = document.createElement("div");
                div.classList.add("producto-carrito");
                div.innerHTML = `
                    <strong>${p.titulo}</strong><br>
                    Cantidad: ${p.cantidad}<br>
                    Precio: $${p.precio.toLocaleString()}<br>
                    Subtotal: $${subtotal.toLocaleString()}
                    <hr>
                `;
                productosCarrito.appendChild(div);
            });
            totalCarrito.textContent = `$${total.toLocaleString()}`;
        }

        mostrarCarrito();

        const btnPagar = document.querySelector(".btnPagar");
        if (btnPagar) btnPagar.addEventListener("click", () => {
            Swal.fire("Lo sentimos", "Estamos trabajando en esto", "error");
        });

        // ================= CERRAR SESIÓN =================
        const btnLogout = document.getElementById("btn_cerrar_sesion");
        if (btnLogout) {
            btnLogout.addEventListener("click", () => {
                localStorage.removeItem("token");
                localStorage.removeItem("usuarioActivo");
                window.location.href = "/loginSpring/login.html";
            });
        }
    }
});