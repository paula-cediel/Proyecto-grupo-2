// Inicializar almacenamiento si no existe
if (!localStorage.getItem("productosTienda")) {
    localStorage.setItem("productosTienda", JSON.stringify([]));
}

let publicaciones = JSON.parse(localStorage.getItem("productosTienda"));

const form = document.getElementById("postForm");
const feed = document.getElementById("feed");

function convertirImagenBase64(file) {
    return new Promise((resolve) => {
        const lector = new FileReader();
        lector.onloadend = () => resolve(lector.result);
        lector.readAsDataURL(file);
    });
}

form.addEventListener("submit",async function(e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const cost = document.getElementById("cost").value;
    const desc = document.getElementById("description").value;
    const cantidad = document.getElementById("stock").value;
    const imgFile = document.getElementById("image").files[0];
    const imgBase64 = await convertirImagenBase64(imgFile);

    const nuevaPublicacion = {
        id: Date.now(),
        titulo: title,
        precio: Number(cost),
        descripcion: desc,
        cantidad: Number(cantidad),
        imagen: imgBase64 //
    };

    publicaciones.push(nuevaPublicacion);
    localStorage.setItem("productosTienda", JSON.stringify(publicaciones));

    mostrarPublicaciones();
    form.reset();
});

function mostrarPublicaciones() {
    feed.innerHTML = "";
    publicaciones.forEach((pub) => {
        const card = document.createElement("div");
        card.classList.add("col-12", "col-sm-6", "col-lg-4");

        card.innerHTML = `
        <div class="card shadow h-100">
            <img src="${pub.imagen}" class="card-img-top" alt="Imagen">
            <div class="card-body">
                <h5>${pub.titulo}</h5>
                <p><strong>$${pub.precio}</strong></p>
                <p>${pub.descripcion}</p>
                <p><strong>Existencias:</strong> ${pub.cantidad}</p>

                <button class="btn btn-warning btn-sm actualizar">Editar</button>
                <button class="btn btn-danger btn-sm eliminar">Eliminar</button>
            </div>
        </div>`;

        feed.appendChild(card);

        card.querySelector(".eliminar").addEventListener("click", () => {
            eliminarPublicacion(pub.id);
        });

        card.querySelector(".actualizar").addEventListener("click", () => {
            actualizarPublicacion(pub.id);
        });
    });
}

function eliminarPublicacion(id) {
    publicaciones = publicaciones.filter(p => p.id !== id);
    localStorage.setItem("productosTienda", JSON.stringify(publicaciones));
    mostrarPublicaciones();
}

function actualizarPublicacion(id) {
    const pub = publicaciones.find(p => p.id === id);
    if (!pub) return;

    pub.titulo = prompt("Nuevo título:", pub.titulo) || pub.titulo;
    pub.precio = Number(prompt("Nuevo precio:", pub.precio)) || pub.precio;
    pub.descripcion = prompt("Nueva descripción:", pub.descripcion) || pub.descripcion;
    pub.cantidad = Number(prompt("Nueva cantidad:", pub.cantidad)) || pub.cantidad;

    localStorage.setItem("productosTienda", JSON.stringify(publicaciones));
    mostrarPublicaciones();
}

mostrarPublicaciones();
