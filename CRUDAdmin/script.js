// Lista global de publicaciones
let publicaciones = [];

const form = document.getElementById("postForm");
const feed = document.getElementById("feed");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const cost = document.getElementById("cost").value;
    const desc = document.getElementById("description").value;
    const cantidad = parseInt(document.getElementById("stock").value); // NUEVO CAMPO
    const imgFile = document.getElementById("image").files[0];
    const imgURL = URL.createObjectURL(imgFile);

    // Crear objeto publicación
    const nuevaPublicacion = {
        id: Date.now(), // Identificador único
        titulo: title,
        precio: cost,
        descripcion: desc,
        cantidad: cantidad,
        imagen: imgURL
    };

    publicaciones.push(nuevaPublicacion);
    console.log("Lista de publicaciones:", publicaciones);

    mostrarPublicaciones();
    form.reset();
});


// --------------------------------------
// FUNCIÓN PARA MOSTRAR TODAS LAS CARDS
// --------------------------------------
function mostrarPublicaciones() {
    feed.innerHTML = ""; // limpiar el feed

    publicaciones.forEach((pub) => {
        const card = document.createElement("div");
        card.classList.add("col-12", "col-sm-6", "col-lg-4");

        card.innerHTML = `
        <div class="card shadow h-100">
            <img src="${pub.imagen}" class="card-img-top" alt="Imagen publicación">

            <div class="card-body">
                <h5 class="card-title">${pub.titulo}</h5>
                <h6 class="card-title">$${pub.precio}</h6>
                <p class="card-text">${pub.descripcion}</p>
                <p class="card-text"><strong>Existencias:</strong> ${pub.cantidad}</p>

                <div class="d-flex gap-3">
                    <button class="btn btn-warning btn-sm actualizar-btn">Actualizar</button>
                    <button class="btn btn-danger btn-sm eliminar-btn">Eliminar</button>
                </div>

                <div class="d-flex align-items-center gap-2 mt-3">
                    <i class="bi bi-heart fs-4 like-btn"></i>
                    <span class="likes-count">0</span> likes
                </div>
            </div>
        </div>
        `;

        feed.appendChild(card);

        // ---- BOTÓN ELIMINAR ----
        card.querySelector(".eliminar-btn").addEventListener("click", function () {
            eliminarPublicacion(pub.id);
        });

        // ---- BOTÓN ACTUALIZAR ----
        card.querySelector(".actualizar-btn").addEventListener("click", function () {
            actualizarPublicacion(pub.id);
        });

        // ---- LIKE ----
        const likeBtn = card.querySelector(".like-btn");
        const likesCount = card.querySelector(".likes-count");

        likeBtn.addEventListener("click", function () {
            likesCount.textContent = parseInt(likesCount.textContent) + 1;
            likeBtn.classList.add("liked");
        });
    });
}


// --------------------------------------
// FUNCIÓN ELIMINAR
// --------------------------------------
function eliminarPublicacion(id) {
    publicaciones = publicaciones.filter(pub => pub.id !== id);
    console.log("Publicación eliminada. Lista actual:", publicaciones);
    mostrarPublicaciones();
}


// --------------------------------------
// FUNCIÓN ACTUALIZAR
// --------------------------------------
function actualizarPublicacion(id) {
    const pub = publicaciones.find(p => p.id === id);

    if (!pub) return;

    // Pedimos nueva información
    const nuevoTitulo = prompt("Nuevo título:", pub.titulo);
    const nuevoPrecio = prompt("Nuevo precio:", pub.precio);
    const nuevaDescripcion = prompt("Nueva descripción:", pub.descripcion);
    const nuevoStock = prompt("Nueva cantidad:", pub.cantidad);

    // Si el usuario canceló, no hacemos nada
    if (nuevoTitulo === null) return;

    // Actualizar los datos
    pub.titulo = nuevoTitulo;
    pub.precio = nuevoPrecio;
    pub.descripcion = nuevaDescripcion;
    pub.cantidad = parseInt(nuevoStock);

    console.log("Publicación actualizada:", pub);
    console.log("Lista completa:", publicaciones);

    mostrarPublicaciones();
}
