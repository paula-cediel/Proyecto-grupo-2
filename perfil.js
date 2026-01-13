document.addEventListener("DOMContentLoaded", () => {
    const perfil = document.getElementById("navPerfil");
    const registro = document.getElementById("navRegistro");
    const login = document.getElementById("navLogin");
    const contenedor = document.getElementById("contenido_perfil"); 
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (usuario) {
        if (registro) {
            registro.style.display = "none";
        }    
        if (login){
            login.style.display = "none";
        } 
        if (perfil){
            perfil.style.display = "block";
        }
    } else {
        if (registro){
            registro.style.display = "block";
        } 
        if (login){
            login.style.display = "block";
        }
        if (perfil){
            perfil.style.display = "none";
        } 
    }

    // Sin loguear
    if (!usuario) {
        perfil.style.display = "none";
        return;
    }

    //Con administrador
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
            <div class="card-header bg-primary create text-white fw-bold">
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
    if (btnLogout){
        btnLogout.style.display = "inline-block";
    } 
    if (saludo){
        saludo.textContent = `Hola, ${usuario.nombre}`;
    } 

    }
    // Con cliente
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
    
    <section class="perfil">
        <header class="header_perfil">
            <h1>Mi perfil</h1>
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
        </article>
    </section>

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
    if (btnLogout){
        btnLogout.style.display = "inline-block";
    } 
    if (saludo){
        saludo.textContent = `Hola, ${usuario.nombre}`;
    } 
    
    // Informacion de usuario actual
        document.getElementById("nombre_perfil").textContent = usuario.nombre;
        document.getElementById("correo_perfil").textContent = usuario.correo;
        document.getElementById("telefono_perfil").textContent = usuario.telefono;
    }
});

function cerrarSesion() {
  const btnLogout = document.getElementById("btn_cerrar_sesion");

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      
        // Eliminar usuario activo
      localStorage.removeItem("usuarioActivo");

      // Borrar carrito
      localStorage.removeItem("carrito");

      // Redirigir al home
      window.location.href = "/home/home.html";
    });
  }
}

