/*let productos = JSON.parse(localStorage.getItem("productosTienda")) || [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const listaProductos = document.getElementById("lista-productos");
const carritoContainer = document.getElementById("misCompras");
const subtotal = document.getElementById("subtotal");
const contador = document.getElementById("contador");
const btnVaciar = document.getElementById("vaciar");

// Asegurarse que todos los precios sean números al cargar
productos = productos.map(p => ({ ...p, precio: Number(p.precio) }));

mostrarProductos();
actualizarCarrito();

function mostrarProductos() {
    listaProductos.innerHTML = "";

    productos.forEach(prod => {
        const itemCarrito = carrito.find(p => p.id === prod.id);
        const cantidadCompra = itemCarrito ? itemCarrito.cantidadCompra : 0;

        const card = document.createElement("div");
        card.classList.add("col-12", "col-sm-6", "col-lg-4");

        card.innerHTML = `
        <div class="card shadow h-100">
            <img src="${prod.imagen}" class="card-img-top" alt="${prod.titulo}">
            <div class="card-body text-center">
                <h5>${prod.titulo}</h5>
                <p class="fw-bold">$${prod.precio.toFixed(2)}</p>
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
//esto fue lo unico que toque para eliminar producto por producto hasta la linea 152
    carrito.forEach(item => {
    total += item.precio * item.cantidadCompra;
    items += item.cantidadCompra;

    carritoContainer.innerHTML += `
    <div class="d-flex justify-content-between align-items-center border-bottom p-2">
        <div>
            <span>${item.titulo} x${item.cantidadCompra}</span>
        </div>

        <div class="d-flex align-items-center gap-2">
            <strong>$${(item.precio * item.cantidadCompra).toFixed(2)}</strong>
            <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${item.id}">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    </div>`;
});

carritoContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-eliminar");
    if (!btn) return;

    const id = Number(btn.dataset.id);

    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    mostrarProductos();
});

    subtotal.textContent = total.toFixed(2);
    contador.textContent = items;
}

btnVaciar.addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    mostrarProductos();
});

// Control de roles de usuario
const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

if (!usuario) {
    navPerfil.style.display = "none";
    navLogout.style.display = "none";
} else {
    navLogin.style.display = "none";

    if (usuario.rol !== "admin") {
        navPerfil.style.display = "none";
    }
}
*/const API_PRODUCTOS = "http://localhost:8081/productos";
const API_FACTURAS = "http://localhost:8081/facturas";

let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const listaProductos = document.getElementById("lista-productos");
const carritoContainer = document.getElementById("misCompras");
const subtotal = document.getElementById("subtotal");
const contador = document.getElementById("contador");
const btnVaciar = document.getElementById("vaciar");
// =====================
// CARGAR PRODUCTOS BACKEND
// =====================
async function cargarProductos() {
    const res = await fetch(API_PRODUCTOS);
    productos = await res.json();
    mostrarProductos();
    actualizarCarrito();
}

cargarProductos();
// Asegurarse que todos los precios sean números al cargar
productos = productos.map(p => ({ ...p, precio: Number(p.precio) }));

mostrarProductos();
actualizarCarrito();

function mostrarProductos() {
    listaProductos.innerHTML = "";

    productos.forEach(prod => {
        const itemCarrito = carrito.find(p => p.idProducto === prod.idProducto);
        const cantidadCompra = itemCarrito ? itemCarrito.cantidad : 0;

        const card = document.createElement("div");
        card.className = "col-12 col-sm-6 col-lg-4";

        card.innerHTML = `
        <div class="card shadow h-100">
            <img src="${prod.imagen}" class="card-img-top">
            <div class="card-body text-center">
                <h5>${prod.nombre}</h5>
                <p class="fw-bold">$${prod.precio_compra}</p>
                <p>${prod.descripcion}</p>
                <p class="text-success fw-bold">Stock: ${prod.stock}</p>

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

        btnAgregar.onclick = () => {
            agregarAlCarrito(prod.idProducto);
            btnAgregar.classList.add("d-none");
            contadorBox.classList.remove("d-none");
            cantidadSpan.textContent = getCantidad(prod.idProducto);
        };

        btnSumar.onclick = () => {
            if (getCantidad(prod.idProducto) < prod.stock) {
                agregarAlCarrito(prod.idProducto);
                cantidadSpan.textContent = getCantidad(prod.idProducto);
            }
        };

        btnRestar.onclick = () => {
            restarCarrito(prod.idProducto);
            const cant = getCantidad(prod.idProducto);
            cantidadSpan.textContent = cant;

            if (cant === 0) {
                contadorBox.classList.add("d-none");
                btnAgregar.classList.remove("d-none");
            }
        };
    });
}


function getCantidad(id) {
    const item = carrito.find(p => p.id === id);
    return item ? item.cantidadCompra : 0;
}

function agregarAlCarrito(idProducto) {
    let item = carrito.find(p => p.idProducto === idProducto);

    if (!item) {
        carrito.push({ idProducto, cantidad: 1 });
    } else {
        item.cantidad++;
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
        const prod = productos.find(p => p.idProducto === item.idProducto);
        if (!prod) return;

        const subtotalItem = prod.precio_compra * item.cantidad;
        total += subtotalItem;
        items += item.cantidad;

        carritoContainer.innerHTML += `
        <div class="d-flex justify-content-between border-bottom p-2">
            <span>${prod.nombre} x${item.cantidad}</span>
            <strong>$${subtotalItem}</strong>
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
 async function comprar() {
    const token = localStorage.getItem("token");

    const facturaDTO = {
        valorEnvio: 0,
        detalles: carrito.map(item => ({
            cantidadVendida: item.cantidad,
            producto: {
                idProducto: item.idProducto
            }
        }))
    };

    await fetch(`http://localhost:8081/facturas/crear/1/1`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(facturaDTO)
    });

    carrito = [];
    guardarCarrito();
    await cargarProductos(); // refresca stock
    alert("Compra realizada con éxito");
}

// Control de roles de usuario
const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

if (!usuario) {
    navPerfil.style.display = "none";
    navLogout.style.display = "none";
} else {
    navLogin.style.display = "none";

    if (usuario.rol !== "admin") {
        navPerfil.style.display = "none";
    }
}
