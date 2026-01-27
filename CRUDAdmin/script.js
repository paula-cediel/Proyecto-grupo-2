document.addEventListener("DOMContentLoaded", () => {

  const contenedor = document.getElementById("contenido_perfil");
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  if (!usuario) {
    alert("Debes iniciar sesión");
    window.location.href = "/login/login.html";
    return;
  }

  //ADMINISTRADOR
  if (usuario.rol === "admin") {

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
                            <li class="nav-item"id="navContactenos"><a class="nav-link" href="/contactenos/contact-us.html">Contáctenos</a></li>
                            <li class="nav-item d-flex align-items-center ms-2"><span id="saludo">Hola, Administrador</span></li>
                            <li class="nav-item d-flex align-items-center ms-2"></li><button id="btn_cerrar_sesion" style="display:none;"> Cerrar sesión </button></li>
                        </ul>
                    </div>
                </nav>
                <button id="logoutBtn" class="btn btn-danger d-none">Cerrar sesión</button>


            </div>
        </header>
        <div class="container py-4">
            <h1 class="text-center mb-4">Crear productos</h1>
            <div class="card mb-4 shadow">
                <div id="titulo"class="card-header bg-primary create text-white fw-bold">
                    Crear nueva publicación
                </div>
                <div class="card-body">
                    <form id="postForm">
                        <div class="mb-3">
                            <label class="form-label">Nombre producto</label>
                            <input type="text" id="title" class="form-control" maxlength="20" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Precio</label>
                            <input type="number" id="cost" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Descripción</label>
                            <textarea id="description" class="form-control" rows="3" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Existencias</label>
                            <input type="number" id="stock" class="form-control" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Imagen</label>
                            <input type="file" id="image" accept="image/*" class="form-control" required>
                        </div>
                        <button type="submit" class="btn  post w-100">Publicar</button>
                    </form>
                </div>
            </div>
            <h3 class="mb-3">Publicaciones recientes</h3>
            <div id="feed" class="row g-4"></div>
        </div>
        <footer class="mt-auto">
            <div>

                <div class="row">

                    <div class="col-md-4 mb-3">
                        <h5 class="text-uppercase">Letal cosplay</h5>
                        <p>Letal Cosplay ofrece productos de alta calidad a precios accesibles, con opciones personalizadas
                            y acabados profesionales que se adaptan a cada cliente.</p>
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
                            <li class="list-inline-item"><a href="https://www.facebook.com/profile.php?id=61579635025362"><i
                                        class="bi bi-facebook"></i></a></li>
                            <li class="list-inline-item"><a href="#"><i class="bi bi-twitter"></i></a></li>
                            <li class="list-inline-item"><a href="https://www.instagram.com/letalcosplay/"><i
                                        class="bi bi-instagram"></i></a></li>
                        </ul>
                    </div>

                </div>

                <hr class="mb-4">

                <p>&copy; 2025 Letal Cosplay, todos los derechos reservados.</p>

            </div>
        </footer>
        `;

    cerrarSesion();

    const btnLogout = document.getElementById("btn_cerrar_sesion");
    const saludo = document.getElementById("saludo");

    if (btnLogout) btnLogout.style.display = "inline-block";
    if (saludo) saludo.textContent = `Hola, ${usuario.nombre}`;

    //Productos

    if (!localStorage.getItem("productosTienda")) {
      localStorage.setItem("productosTienda", JSON.stringify([]));
    }

    let publicaciones = JSON.parse(localStorage.getItem("productosTienda"));

    const form = document.getElementById("postForm");
    const feed = document.getElementById("feed");

    function mostrar() {
      feed.innerHTML = "";
      publicaciones.forEach(pub => {
        const card = document.createElement("div");
        card.className = "col-sm-6 col-lg-4 mt-3";
        card.innerHTML = `
          <div class="card shadow h-100">
            <img src="${pub.imagen}" class="card-img-top">
            <div class="card-body">
              <h5>${pub.titulo}</h5>
              <p class="fw-bold">$${pub.precio}</p>
              <p>${pub.descripcion}</p>
              <p><strong>Existencias:</strong> ${pub.cantidad}</p>
              <button class="btn btn-warning btn-sm editar">Editar</button>
              <button class="btn btn-danger btn-sm eliminar">Eliminar</button>
            </div>
          </div>`;

        card.querySelector(".eliminar").onclick = () => {
          publicaciones = publicaciones.filter(p => p.id !== pub.id);
          localStorage.setItem("productosTienda", JSON.stringify(publicaciones));
          mostrar();
        };

        card.querySelector(".editar").onclick = () => {
          pub.titulo = prompt("Nuevo nombre:", pub.titulo) || pub.titulo;
          pub.precio = Number(prompt("Nuevo precio:", pub.precio)) || pub.precio;
          pub.descripcion = prompt("Nueva descripción:", pub.descripcion) || pub.descripcion;
          pub.cantidad = Number(prompt("Nuevo stock:", pub.cantidad)) || pub.cantidad;
          localStorage.setItem("productosTienda", JSON.stringify(publicaciones));
          mostrar();
        };

        feed.appendChild(card);
      });
    }

    if (form && feed) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newProduct = {
          id: Date.now(),
          titulo: title.value,
          precio: Number(cost.value),
          descripcion: description.value,
          cantidad: Number(stock.value),
          imagen: await comprimirImagen(image.files[0])
        };

        publicaciones.push(newProduct);
        localStorage.setItem("productosTienda", JSON.stringify(publicaciones));
        form.reset();
        mostrar();
      });

      mostrar();
    }

  }

//   CLIENTE
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

            
            <section class="direccion">
                <h1>Mis direcciones</h1>
                <form id="formDireccion">
                    <label for="inputAddress">Dirección</label>
                    <input type="text" id="inputAddress" placeholder="Ej: Calle 123 #45-67" required>
                    <small class="error" id="errorDireccion"></small>
                    <br>
                    <button type="submit" class="btn primary">Agregar</button>
                </form>

                <ul id="listaDirecciones">
                    
                </ul>
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
                        <p>Letal Cosplay ofrece productos de alta calidad a precios accesibles, con opciones personalizadas
                            y acabados profesionales que se adaptan a cada cliente.</p>
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
                            <li class="list-inline-item"><a href="https://www.facebook.com/profile.php?id=61579635025362"><i
                                        class="bi bi-facebook"></i></a></li>
                            <li class="list-inline-item"><a href="#"><i class="bi bi-twitter"></i></a></li>
                            <li class="list-inline-item"><a href="https://www.instagram.com/letalcosplay/"><i
                                        class="bi bi-instagram"></i></a></li>
                        </ul>
                    </div>

                </div>

                <hr class="mb-4">

                <p>&copy; 2025 Letal Cosplay, todos los derechos reservados.</p>

            </div>
        </footer>
        `;

    cerrarSesion();

    const btnEditar = document.querySelector(".editar_usuario");

    if (btnEditar) {
        btnEditar.addEventListener("click", () => {

            const nuevoNombre = prompt("Nuevo nombre:", usuario.nombre);
            const nuevoTelefono = prompt("Nuevo teléfono:", usuario.telefono);
            const saludo = document.getElementById("saludo")

            if (nuevoNombre === null || nuevoTelefono === null){
                return;
            } 

            let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

            const i = usuarios.findIndex( u => u.correo === usuario.correo);

            if (i === -1){
                return;
            } 

            usuarios[i].nombre = nuevoNombre;
            usuarios[i].telefono = nuevoTelefono;

            usuario.nombre = nuevoNombre;
            usuario.telefono = nuevoTelefono;

            localStorage.setItem("usuarios", JSON.stringify(usuarios));
            localStorage.setItem("usuarioActivo", JSON.stringify(usuario));

            document.getElementById("nombre_perfil").textContent = nuevoNombre;
            document.getElementById("telefono_perfil").textContent = nuevoTelefono;
            saludo.textContent =  `Hola, ${nuevoNombre} `

            Swal.fire("Buen trabajo", "Perfil actualizado correctamente", "success");
        });
    }  
    
    const formDireccion = document.getElementById("formDireccion");
    const inputDireccion = document.getElementById("inputAddress");
    const listaDirecciones = document.getElementById("listaDirecciones");

    // Función mostrar las direcciones guardadas en localStorage
    function mostrarDirecciones() {
        
        listaDirecciones.innerHTML = "";
        const direcciones = JSON.parse(localStorage.getItem("direcciones")) || [];
        if (direcciones.length === 0) {
            listaDirecciones.innerHTML = `<li class="vacio">No hay direcciones guardadas</li>`;
            return;
        }
        direcciones.forEach(direccion => {
            const li = document.createElement("li");
            li.textContent = direccion;
            listaDirecciones.appendChild(li);
        });
    }

    //Validaciones input dirección
    const direccionInput = document.getElementById("inputAddress");
    const errorDireccion = document.getElementById("errorDireccion");
    direccionInput.addEventListener("input", () => {
        if (direccionInput.value.trim() === "") {
            errorDireccion.textContent = "No puede estar vacío";
        } else if (!isNaN(direccionInput.value)) {
            errorNombre.textContent = "El nombre no puede ser solo números";
        } else if (direccionInput.value.length < 15) {
            errorDireccion.textContent = "Debe tener al menos 15 caracteres";
        } else {
            errorDireccion.textContent = "";
        }
        });

    // Función agregar dirección
    formDireccion.addEventListener("submit", (e) => {
        e.preventDefault();

        const direccion = inputDireccion.value.trim();
        if (!direccion){
            return;
        } 

        let direcciones = JSON.parse(localStorage.getItem("direcciones")) || [];

        direcciones.push(direccion);
        localStorage.setItem("direcciones", JSON.stringify(direcciones));
        inputDireccion.value = "";

        Swal.fire("Buen trabajo", "Dirección guardada correctamente", "success");

        mostrarDirecciones();
    });

    mostrarDirecciones();

    const productosCarrito = document.getElementById("productosCarrito");
    const totalCarrito = document.getElementById("totalCarrito");

    // Función mostrar carrito en cliente
    function mostrarCarrito() {
        productosCarrito.innerHTML = "";
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        if (carrito.length === 0) {
            productosCarrito.innerHTML = `<p class="vacio">Tu carrito está vacío</p>`;
            totalCarrito.textContent = "$0";
            return;
        }
        let total = 0;
        carrito.forEach(producto => {
            const subtotal = producto.precio * producto.cantidad;
            total += subtotal;
            const div = document.createElement("div");
            div.classList.add("producto-carrito");
            div.innerHTML = `
            <strong>${producto.titulo}</strong><br>
            Cantidad: ${producto.cantidad}<br>
            Precio: $${producto.precio.toLocaleString()}<br>
            Subtotal: $${subtotal.toLocaleString()}
            <hr>
            `;
            productosCarrito.appendChild(div);
        });

    totalCarrito.textContent = `$${total.toLocaleString()}`;
    }
    mostrarCarrito();

    // Funcion pagar
    const btnPagar = document.querySelector(".btnPagar");

    if (btnPagar) {
        btnPagar.addEventListener("click", () => {
          Swal.fire("Lo sentimos", "Estamos trabajando en esto", "error");  
        })
    }

    const btnLogout = document.getElementById("btn_cerrar_sesion");
    const saludo = document.getElementById("saludo");

    if (btnLogout) btnLogout.style.display = "inline-block";
    if (saludo) saludo.textContent = `Hola, ${usuario.nombre}`;

    document.getElementById("nombre_perfil").textContent = usuario.nombre;
    document.getElementById("correo_perfil").textContent = usuario.correo;
    document.getElementById("telefono_perfil").textContent = usuario.telefono;
  }

});

//Funcion cerrar sesion
function cerrarSesion() {
  const btnLogout = document.getElementById("btn_cerrar_sesion");

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("usuarioActivo");
      localStorage.removeItem("carrito");
      window.location.href = "/home/home.html";
    });
  }
}

//Comprimir imagen
function comprimirImagen(file, maxWidth = 600) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const scale = maxWidth / img.width;
        const canvas = document.createElement("canvas");
        canvas.width = maxWidth;
        canvas.height = img.height * scale;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
    };
    reader.readAsDataURL(file);
  });
}
