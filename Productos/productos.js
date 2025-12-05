let productos = JSON.parse(localStorage.getItem("productosTienda")) || [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const listaProductos = document.getElementById("lista-productos");
const carritoContainer = document.getElementById("misCompras");
const subtotal = document.getElementById("subtotal");
const contador = document.getElementById("contador");
const btnVaciar = document.getElementById("vaciar");

mostrarProductos();
actualizarCarrito();

function mostrarProductos() {
    listaProductos.innerHTML = "";

    productos.forEach(prod => {
        const itemCarrito = carrito.find(p => p.id === prod.id);
        /*
        function encontrarItem(carrito, prod) {
            for (let i = 0; i < carrito.length; i++) {
                if (carrito[i].id === prod.id) {
                    return carrito[i]; // Devuelve el primer elemento que coincide
                }
            }
            return undefined; // Si no se encuentra ningún elemento, devuelve undefined
        }

        const itemCarrito = encontrarItem(carrito, prod);*/
        const cantidadCompra = itemCarrito ? itemCarrito.cantidadCompra : 0;
        /*let cantidadCompra;
        if (itemCarrito) {
            cantidadCompra = itemCarrito.cantidadCompra;
        } else {
            cantidadCompra = 0;
        }*/
        const card = document.createElement("div");
        card.classList.add("col-12", "col-sm-6", "col-lg-4");

        card.innerHTML = `
        <div class="card shadow h-100">
            <img src="${prod.imagen}" class="card-img-top" alt="${prod.titulo}">
            <div class="card-body text-center">
                <h5>${prod.titulo}</h5>
                <p class="fw-bold">$${prod.precio}</p>
                <p>${prod.descripcion}</p>
                <p class="text-success fw-bold">Stock: ${prod.cantidad}</p>

                <button class="btn btn-dark w-100 agregarCarrito ${cantidadCompra > 0 ? "d-none" : ""}">
                    Agregar al carrito
                </button>

                <div class="contador-container d-flex justify-content-center align-items-center gap-3 mt-2 ${cantidadCompra === 0 ? "d-none" : ""}">
                    <button class="btn btn-outline-dark btn-restar">−</button>
                    <span class="cantidadCompra fw-bold">${cantidadCompra}</span>
                    <button class="btn btn-outline-dark btn-sumar">+</button>
                </div>
            </div>
        </div>
        `;

        listaProductos.appendChild(card);

        const btnAgregar = card.querySelector(".agregarCarrito");
        const btnRestar = card.querySelector(".btn-restar");
        const btnSumar = card.querySelector(".btn-sumar");
        const contadorBox = card.querySelector(".contador-container");
        const cantidadSpan = card.querySelector(".cantidadCompra");

        btnAgregar.addEventListener("click", () => {
            agregarAlCarrito(prod.id);
            btnAgregar.classList.add("d-none");
            contadorBox.classList.remove("d-none");
            cantidadSpan.textContent = getCantidad(prod.id);
        });

        btnSumar.addEventListener("click", () => {
            if (getCantidad(prod.id) < prod.cantidad) {
                agregarAlCarrito(prod.id);
                cantidadSpan.textContent = getCantidad(prod.id);
            }
        });

        btnRestar.addEventListener("click", () => {
            restarCarrito(prod.id);
            const cant = getCantidad(prod.id);
            cantidadSpan.textContent = cant;

            if (cant === 0) {
                contadorBox.classList.add("d-none");
                btnAgregar.classList.remove("d-none");
            }
        });
    });
}

function getCantidad(id) {
    const item = carrito.find(p => p.id === id);
    return item ? item.cantidadCompra : 0;
}

function agregarAlCarrito(id) {
    let item = carrito.find(p => p.id === id);

    if (!item) {
        const prod = productos.find(p => p.id === id);
        carrito.push({ ...prod, cantidadCompra: 1 });
    } else if (item.cantidadCompra < item.cantidad) {
        item.cantidadCompra++;
    }

    guardarCarrito();
}

function restarCarrito(id) {
    let item = carrito.find(p => p.id === id);
    if (!item) return;

    item.cantidadCompra--;

    if (item.cantidadCompra <= 0) {
        carrito = carrito.filter(p => p.id !== id);
    }

    guardarCarrito();
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
}

function actualizarCarrito() {
    carritoContainer.innerHTML = "";
    let total = 0;
    let items = 0;

    carrito.forEach(item => {
        total += item.precio * item.cantidadCompra;
        items += item.cantidadCompra;

        carritoContainer.innerHTML += `
        <div class="d-flex justify-content-between border-bottom p-2">
            <span>${item.titulo} x${item.cantidadCompra}</span>
            <strong>$${item.precio * item.cantidadCompra}</strong>
        </div>`;
    });

    subtotal.textContent = total;
    contador.textContent = items;
}

btnVaciar.addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    mostrarProductos();
});
