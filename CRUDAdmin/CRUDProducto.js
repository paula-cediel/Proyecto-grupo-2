document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.getElementById("contenido_perfil");
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
    const token = localStorage.getItem("token");

if (!token) {
  alert("Sesión expirada");
  window.location.href = "/loginSpring/login.html";
}

    const API_PRODUCTOS = "http://localhost:8081/productos";

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
                            <li class="nav-item"><a class="nav-link" href="/acerca_de_nosotros/about.html">Sobre
                                    nosotros</a></li>
                            <li class="nav-item" id="navProductos"><a class="nav-link" href="/Productos/productos.html">Productos</a></li>
                            <li class="nav-item" id="navPerfil"><a class="nav-link" href="/CRUDAdmin/main.html">Perfil</a></li>
                            <li class="nav-item"id="navContactenos"><a class="nav-link" href="/contactenos/contact-us.html">Contáctenos</a></li>
                            <li class="nav-item d-flex align-items-center ms-2"><span id="saludo"></span></li>
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
        <div class="container py-4">
            <h1 class="mb-4">Productos disponibles</h1>
            <div id="listaProductos" class="row g-3"></div>
        </div>
        `;

        const lista = document.getElementById("listaProductos");

        async function cargarProductosCliente() {
            const res = await fetch(API_PRODUCTOS);
            const productos = await res.json();

            lista.innerHTML = "";
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
                        <button class="btn btn-primary btn-sm">Agregar al carrito</button>
                    </div>
                </div>`;
                lista.appendChild(div);
            });
        }

        cargarProductosCliente();
    }
});
