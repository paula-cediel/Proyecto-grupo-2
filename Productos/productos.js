// ===============================
// API BACKEND
// ===============================
const API_PRODUCTOS = "http://localhost:8081/productos";
const API_FACTURAS = "http://localhost:8081/facturas";

// ===============================
// ESTADO GLOBAL
// ===============================
let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ===============================
// FUNCIONES UTILES
// ===============================
function formatearPrecio(valor) {
    return Number(valor).toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// ===============================
// ELEMENTOS DOM
// ===============================
const listaProductos = document.getElementById("lista-productos");
const carritoContainer = document.getElementById("misCompras");
const subtotal = document.getElementById("subtotal");
const contador = document.getElementById("contador");
const btnVaciar = document.getElementById("vaciar");
const btnPagar = document.getElementById("btnPagar");

// ===============================
// CARGAR PRODUCTOS DESDE BACKEND
// ===============================
async function cargarProductos() {
    const res = await fetch(API_PRODUCTOS);
    productos = await res.json();
    mostrarProductos();
    actualizarCarrito();
}

cargarProductos();

// ===============================
// MOSTRAR PRODUCTOS
// ===============================

function mostrarProductos() {
    listaProductos.innerHTML = "";

    productos.forEach(prod => {
        const cantidadCompra = getCantidad(prod.idProducto);

        const card = document.createElement("div");
        card.className = "col-12 col-sm-6 col-lg-4";

        card.innerHTML = `
        <div class="card shadow h-100">
            <img src="${prod.imagen}" class="card-img-top">
            <div class="card-body text-center">
                <h5>${prod.nombre}</h5>
                <p class="fw-bold">${formatearPrecio(prod.precio_compra)}</p>
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

// ===============================
// CARRITO LOGICA
// ===============================
function getCantidad(idProducto) {
    const item = carrito.find(p => p.idProducto === idProducto);
    return item ? item.cantidad : 0;
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

function restarCarrito(idProducto) {
    let item = carrito.find(p => p.idProducto === idProducto);
    if (!item) return;

    item.cantidad--;

    if (item.cantidad <= 0) {
        carrito = carrito.filter(p => p.idProducto !== idProducto);
    }

    guardarCarrito();
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
}

// ===============================
// MOSTRAR CARRITO
// ===============================
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
<div class="d-flex justify-content-between align-items-center border-bottom p-2">
    <span>${prod.nombre} x${item.cantidad}</span>

    <div class="d-flex gap-2 align-items-center">
        <strong>${formatearPrecio(subtotalItem)}</strong>
        <button class="btn btn-sm btn-outline-danger"
            onclick="eliminarProducto(${item.idProducto})">
            <i class="bi bi-trash"></i>
        </button>
    </div>
</div>`;

    });

    subtotal.textContent = formatearPrecio(total);
    contador.textContent = items;
}

// ===============================
// VACIAR CARRITO
// ===============================
btnVaciar.addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    mostrarProductos();
});

// ===============================
// COMPRAR → CREA FACTURA EN BACKEND
// ===============================
btnPagar.addEventListener("click", comprar);

async function comprar() {

    if (carrito.length === 0) {
        Swal.fire("Error", "El carrito está vacío", "error");
        return;
    }

    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuario) {
        Swal.fire("Error", "Debes iniciar sesión", "error");
        return;
    }

    const facturaDTO = {
        valorEnvio: 8500.00,
        detalles: carrito.map(item => ({
            cantidadVendida: item.cantidad,
            producto: {
                idProducto: item.idProducto
            }
        }))
        
    };

    try {
        const res = await fetch(
            `${API_FACTURAS}/crear/${usuario.id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(facturaDTO)
            }
        );

        if (!res.ok) throw new Error("Error al crear factura");

        const facturaCreada = await res.json();

        carrito = [];
        guardarCarrito();
        await cargarProductos();

        generarPDF(facturaCreada);

        Swal.fire("¡Felicitaciones!", "Compra realizada con éxito", "success");

    } catch (error) {
        console.error(error);
        Swal.fire("Error", "Error al procesar la compra", "error");
    }
}

// ===============================
// GENERAR PDF FACTURA (FRONTEND)
// ===============================
function generarPDF(factura) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("FACTURA - LETAL COSPLAY", 20, 20);

    doc.setFontSize(12);
    doc.text(`Factura #${factura.idFactura}`, 20, 35);
    doc.text(`Fecha: ${factura.fecha}`, 20, 42);

    let y = 55;

    doc.text("Productos:", 20, y);
    y += 10;

    factura.detalles.forEach(det => {
        doc.text(`${det.producto.nombre} x${det.cantidadVendida} - ${formatearPrecio(det.precioUnitario * det.cantidadVendida)}`, 20, y);
        y += 8;
    });

    y += 10;
    doc.text(`Envío: ${formatearPrecio(factura.valorEnvio)}`, 20, y);
    y += 8;
    doc.text(`TOTAL: ${formatearPrecio(factura.total)}`, 20, y);;

    doc.save(`factura_${factura.idFactura}.pdf`);
}
function eliminarProducto(idProducto) {
    carrito = carrito.filter(p => p.idProducto !== idProducto);
    guardarCarrito();
    mostrarProductos();
}
//FINAL UNIDO CON FRONT Y BACK
