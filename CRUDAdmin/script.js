if (!localStorage.getItem("productosTienda")) {
    localStorage.setItem("productosTienda", JSON.stringify([]));
}

let publicaciones = JSON.parse(localStorage.getItem("productosTienda"));

const form = document.getElementById("postForm");
const feed = document.getElementById("feed");

// Convertimos imagen reducida a base64
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
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/jpeg", 0.7));
            };
        };
        reader.readAsDataURL(file);
    });
}

form.addEventListener("submit", async e => {
    e.preventDefault();

    const newProduct = {
        id: Date.now(),
        titulo: title.value,
        precio: Number(cost.value),
        descripcion: description.value,
        cantidad: Number(stock.value),
        imagen: await comprimirImagen(image.files[0]) // Aquí comprimimos
    };

    publicaciones.push(newProduct);
    localStorage.setItem("productosTienda", JSON.stringify(publicaciones));
    form.reset();
    mostrar();
});

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
                <button class="btn editar btn-warning btn-sm editar">Editar</button>
                <button class="btn eliminar btn-danger btn-sm eliminar">Eliminar</button>
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

mostrar();
