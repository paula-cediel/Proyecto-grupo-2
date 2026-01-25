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
    <main class="perfil-grid container mt-4">
        <div class="row">
            <section class="col-md-6 mb-4">
                <div class="card shadow">
                    <div class="card-header bg-dark-purple text-white">
                        <h2 class="h5 mb-0">Mis Datos Personales</h2>
                    </div>
                    <div class="card-body">
                        <form id="formPerfil">
                            <div class="mb-3">
                                <label class="form-label">Nombre</label>
                                <input type="text" id="edit_nombre" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Apellido</label>
                                <input type="text" id="edit_apellido" class="form-control">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Correo (No editable)</label>
                                <input type="email" id="edit_correo" class="form-control" readonly>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Teléfono</label>
                                <input type="number" id="edit_telefono" class="form-control">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Dirección de Envío</label>
                                <input type="text" id="edit_direccion" class="form-control" placeholder="Calle, Número, Ciudad">
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Guardar Cambios</button>
                        </form>
                    </div>
                </div>
            </section>

            <section class="col-md-6 mb-4">
                <div class="card shadow">
                    <div class="card-header bg-dark-purple text-white">
                        <h2 class="h5 mb-0">Califica nuestra tienda</h2>
                    </div>
                    <div class="card-body text-center">
                        <p>Cuéntanos tu experiencia</p>
                        <textarea id="calif_desc" class="form-control mb-3" placeholder="Tu opinión es muy importante..."></textarea>

                        <div class="stars-container mb-3" style="font-size: 2rem; cursor: pointer;">
                            <span class="star" data-v="1">★</span>
                            <span class="star" data-v="2">★</span>
                            <span class="star" data-v="3">★</span>
                            <span class="star" data-v="4">★</span>
                            <span class="star" data-v="5">★</span>
                        </div>
                        <button id="btn_publicar_calif" class="btn btn-dark w-50">Publicar Calificación</button>
                    </div>
                </div>
            </section>
        </div>

        <section class="card shadow mb-4">
            <div class="card-body">
                <h3>Mi Carrito</h3>
                <div id="productosCarrito"></div>
                <div class="text-end mt-2">
                    <strong>Total: <span id="totalCarrito">$0</span></strong>
                </div>
            </div>
        </section>
    </main>
    `;

    // 1. CARGAR DATOS EN EL FORMULARIO DESDE EL BACK
async function cargarDatosPerfil() {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) return;

    try {
        const resp = await fetch(`http://localhost:8081/usuarios/${usuarioActivo.id}`);
        const data = await resp.json();

        document.getElementById("edit_nombre").value = data.nombre || "";
        document.getElementById("edit_apellido").value = data.apellido || "";
        document.getElementById("edit_correo").value = data.correo || "";
        document.getElementById("edit_telefono").value = data.telefono || "";
        document.getElementById("edit_direccion").value = data.direccion || "";
        
        // Actualizar saludo en el nav
        document.getElementById("saludo").textContent = `Hola, ${data.nombre}`;
    } catch (err) {
        console.error("Error cargando perfil", err);
    }
}

// 2. ACTUALIZAR PERFIL (EVENTO SUBMIT)
document.getElementById("formPerfil").addEventListener("submit", async (e) => {
    e.preventDefault();
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    const datosActualizados = {
        nombre: document.getElementById("edit_nombre").value,
        apellido: document.getElementById("edit_apellido").value,
        telefono: document.getElementById("edit_telefono").value,
        direccion: document.getElementById("edit_direccion").value,
        correo: document.getElementById("edit_correo").value // El back lo necesita para no perderlo
    };

    try {
        const resp = await fetch(`http://localhost:8081/usuarios/${usuarioActivo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosActualizados)
        });

        if (resp.ok) {
            Swal.fire("Éxito", "Perfil actualizado correctamente", "success");
            cargarDatosPerfil(); // Recargar datos
        }
    } catch (err) {
        Swal.fire("Error", "No se pudo actualizar", "error");
    }
});

// 3. LOGICA DE CALIFICACIONES (HACIA EL BACKEND)
let ratingSeleccionado = 0;
document.querySelectorAll(".star").forEach(s => {
    s.addEventListener("click", () => {
        ratingSeleccionado = s.dataset.v;
        document.querySelectorAll(".star").forEach(x => {
            x.style.color = x.dataset.v <= ratingSeleccionado ? "#ffc107" : "#ccc";
        });
    });
});

document.getElementById("btn_publicar_calif").addEventListener("click", async () => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    const descripcion = document.getElementById("calif_desc").value;

    if (ratingSeleccionado === 0 || !descripcion) {
        return Swal.fire("Atención", "Escribe tu opinión y selecciona estrellas", "warning");
    }

    const calificacionBody = {
        nombre: usuarioActivo.nombre,
        descripcion: descripcion,
        estrellas: parseInt(ratingSeleccionado)
    };

    try {
        // Usamos tu endpoint del Controller: POST /calificaciones/{userId}
        const resp = await fetch(`http://localhost:8081/calificaciones/${usuarioActivo.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(calificacionBody)
        });

        if (resp.ok) {
            Swal.fire("Gracias", "Tu calificación ha sido enviada", "success");
            document.getElementById("calif_desc").value = "";
            // Reset estrellas
        }
    } catch (err) {
        Swal.fire("Error", "Ya has calificado o hubo un error", "error");
    }
});

//         cerrarSesion();

//         const btnEditar = document.querySelector(".editar_usuario");

//         if (btnEditar) {
//             btnEditar.addEventListener("click", () => {

//                 const nuevoNombre = prompt("Nuevo nombre:", usuario.nombre);
//                 const nuevoTelefono = prompt("Nuevo teléfono:", usuario.telefono);
//                 const saludo = document.getElementById("saludo")

//                 if (nuevoNombre === null || nuevoTelefono === null) {
//                     return;
//                 }

//                 let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

//                 const i = usuarios.findIndex(u => u.correo === usuario.correo);

//                 if (i === -1) {
//                     return;
//                 }

//                 usuarios[i].nombre = nuevoNombre;
//                 usuarios[i].telefono = nuevoTelefono;

//                 usuario.nombre = nuevoNombre;
//                 usuario.telefono = nuevoTelefono;

//                 localStorage.setItem("usuarios", JSON.stringify(usuarios));
//                 localStorage.setItem("usuarioActivo", JSON.stringify(usuario));

//                 document.getElementById("nombre_perfil").textContent = nuevoNombre;
//                 document.getElementById("telefono_perfil").textContent = nuevoTelefono;
//                 saludo.textContent = `Hola, ${nuevoNombre} `

//                 Swal.fire("Buen trabajo", "Perfil actualizado correctamente", "success");
//             });
//         }

//         const formDireccion = document.getElementById("formDireccion");
//         const inputDireccion = document.getElementById("inputAddress");
//         const listaDirecciones = document.getElementById("listaDirecciones");

//         // Función mostrar las direcciones guardadas en localStorage
//         function mostrarDirecciones() {

//             listaDirecciones.innerHTML = "";
//             const direcciones = JSON.parse(localStorage.getItem("direcciones")) || [];
//             if (direcciones.length === 0) {
//                 listaDirecciones.innerHTML = `<li class="vacio">No hay direcciones guardadas</li>`;
//                 return;
//             }
//             direcciones.forEach(direccion => {
//                 const li = document.createElement("li");
//                 li.textContent = direccion;
//                 listaDirecciones.appendChild(li);
//             });
//         }

//         //Validaciones input dirección
//         const direccionInput = document.getElementById("inputAddress");
//         const errorDireccion = document.getElementById("errorDireccion");
//         direccionInput.addEventListener("input", () => {
//             if (direccionInput.value.trim() === "") {
//                 errorDireccion.textContent = "No puede estar vacío";
//             } else if (!isNaN(direccionInput.value)) {
//                 errorNombre.textContent = "El nombre no puede ser solo números";
//             } else if (direccionInput.value.length < 15) {
//                 errorDireccion.textContent = "Debe tener al menos 15 caracteres";
//             } else {
//                 errorDireccion.textContent = "";
//             }
//         });

//         // Función agregar dirección
//         formDireccion.addEventListener("submit", (e) => {
//             e.preventDefault();

//             const direccion = inputDireccion.value.trim();
//             if (!direccion) {
//                 return;
//             }

//             let direcciones = JSON.parse(localStorage.getItem("direcciones")) || [];

//             direcciones.push(direccion);
//             localStorage.setItem("direcciones", JSON.stringify(direcciones));
//             inputDireccion.value = "";

//             Swal.fire("Buen trabajo", "Dirección guardada correctamente", "success");

//             mostrarDirecciones();
//         });

//         mostrarDirecciones();

//         const productosCarrito = document.getElementById("productosCarrito");
//         const totalCarrito = document.getElementById("totalCarrito");

//         // Función mostrar carrito en cliente
//         function mostrarCarrito() {
//             productosCarrito.innerHTML = "";
//             const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
//             if (carrito.length === 0) {
//                 productosCarrito.innerHTML = `<p class="vacio">Tu carrito está vacío</p>`;
//                 totalCarrito.textContent = "$0";
//                 return;
//             }
//             let total = 0;
//             carrito.forEach(producto => {
//                 const subtotal = producto.precio * producto.cantidad;
//                 total += subtotal;
//                 const div = document.createElement("div");
//                 div.classList.add("producto-carrito");
//                 div.innerHTML = `
//             <strong>${producto.titulo}</strong><br>
//             Cantidad: ${producto.cantidad}<br>
//             Precio: $${producto.precio.toLocaleString()}<br>
//             Subtotal: $${subtotal.toLocaleString()}
//             <hr>
//             `;
//                 productosCarrito.appendChild(div);
//             });

//             totalCarrito.textContent = `$${total.toLocaleString()}`;
//         }
//         mostrarCarrito();

//         // Funcion pagar
//         const btnPagar = document.querySelector(".btnPagar");

//         if (btnPagar) {
//             btnPagar.addEventListener("click", () => {
//                 Swal.fire("Lo sentimos", "Estamos trabajando en esto", "error");
//             })
//         }

//         const btnLogout = document.getElementById("btn_cerrar_sesion");
//         const saludo = document.getElementById("saludo");

//         if (btnLogout) btnLogout.style.display = "inline-block";
//         if (saludo) saludo.textContent = `Hola, ${usuario.nombre}`;

//         document.getElementById("nombre_perfil").textContent = usuario.nombre;
//         document.getElementById("correo_perfil").textContent = usuario.correo;
//         document.getElementById("telefono_perfil").textContent = usuario.telefono;
//     }

// });

// //Funcion cerrar sesion
// function cerrarSesion() {
//     const btnLogout = document.getElementById("btn_cerrar_sesion");

//     if (btnLogout) {
//         btnLogout.addEventListener("click", () => {
//             localStorage.removeItem("usuarioActivo");
//             localStorage.removeItem("carrito");
//             window.location.href = "/home/home.html";
//         });
//     }
// }

// //Comprimir imagen
// function comprimirImagen(file, maxWidth = 600) {
//     return new Promise(resolve => {
//         const reader = new FileReader();
//         reader.onload = e => {
//             const img = new Image();
//             img.src = e.target.result;
//             img.onload = () => {
//                 const scale = maxWidth / img.width;
//                 const canvas = document.createElement("canvas");
//                 canvas.width = maxWidth;
//                 canvas.height = img.height * scale;
//                 canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
//                 resolve(canvas.toDataURL("image/jpeg", 0.7));
//             };
//         };
//         reader.readAsDataURL(file);
//     });

    // const lista = document.getElementById("listaProductos");

        // async function cargarProductosCliente() {
        //     const res = await fetch(API_PRODUCTOS);
        //     const productos = await res.json();

        //     lista.innerHTML = "";
        //     productos.forEach(p => {
        //         const div = document.createElement("div");
        //         div.className = "col-md-4";
        //         div.innerHTML = `
        //         <div class="card h-100 shadow">
        //             <img src="${p.imagen}" class="card-img-top">
        //             <div class="card-body">
        //                 <h5>${p.nombre}</h5>
        //                 <p>${p.descripcion}</p>
        //                 <p><b>$${p.precio}</b></p>
        //                 <button class="btn btn-primary btn-sm">Agregar al carrito</button>
        //             </div>
        //         </div>`;
        //         lista.appendChild(div);
        //     });
        // }

        // cargarProductosCliente();
}

        
   
