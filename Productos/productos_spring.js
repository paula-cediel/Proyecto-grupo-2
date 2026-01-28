let productos = [];
let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

const listaProductos = document.getElementById('lista-productos');
const carritoContainer = document.getElementById('misCompras');
const subtotal = document.getElementById('subtotal');
const contador = document.getElementById('contador');
const btnVaciar = document.getElementById('vaciar');

async function cargarProductos() {
  try {
    const response = await fetch('http://localhost:8080/productos');
    if (!response.ok) throw new Error('Error al cargar productos del backend');
    productos = await response.json();
    mostrarProductos();
  } catch (error) {
    console.error('Error al conectar con backend:', error);
    // Fallback a localStorage
    productos = JSON.parse(localStorage.getItem('productosTienda') || '[]');
    mostrarProductos();
  }
}

function mostrarProductos() {
  listaProductos.innerHTML = '';
  productos.forEach(prod => {
    const itemCarrito = carrito.find(p => p.id === prod.id);
    const cantidadCompra = itemCarrito ? itemCarrito.cantidadCompra : 0;

    const card = document.createElement('div');
    card.classList.add('col-12', 'col-sm-6', 'col-lg-4');
    card.innerHTML = `
      <div class="card shadow h-100">
        <img src="${prod.imagen}" class="card-img-top" alt="${prod.titulo}">
        <div class="card-body text-center">
          <h5>${prod.titulo}</h5>
          <p class="fw-bold">$${prod.precio}</p>
          <p>${prod.descripcion}</p>
          <p class="text-success fw-bold">Stock: ${prod.cantidad}</p>
          ${cantidadCompra === 0 ? 
            `<button class="btn btn-dark w-100 agregarCarrito">Agregar al carrito</button>` : 
            `<div class="contador-container d-flex justify-content-center align-items-center gap-3 mt-2">
              <button class="btn btn-outline-dark btn-restar">-</button>
              <span class="cantidadCompra fw-bold">${cantidadCompra}</span>
              <button class="btn btn-outline-dark btn-sumar">+</button>
            </div>`
          }
        </div>
      </div>
    `;
    listaProductos.appendChild(card);

    const btnAgregar = card.querySelector('.agregarCarrito');
    const btnRestar = card.querySelector('.btn-restar');
    const btnSumar = card.querySelector('.btn-sumar');
    const contadorBox = card.querySelector('.contador-container');
    const cantidadSpan = card.querySelector('.cantidadCompra');

    // Boton agregar
    if (btnAgregar) {
      btnAgregar.addEventListener('click', () => agregarAlCarrito(prod.id));
      btnAgregar.classList.add('d-none');
      if (contadorBox) contadorBox.classList.remove('d-none');
      if (cantidadSpan) cantidadSpan.textContent = getCantidad(prod.id);
    }

    // Boton sumar
    if (btnSumar) {
      btnSumar.addEventListener('click', () => {
        if (getCantidad(prod.id) < prod.cantidad) {
          agregarAlCarrito(prod.id);
          if (cantidadSpan) cantidadSpan.textContent = getCantidad(prod.id);
        }
      });
    }
    //Boton restar 
    if (btnRestar) {
      btnRestar.addEventListener('click', () => {
        restarCarrito(prod.id);
        const cant = getCantidad(prod.id);
        if (cantidadSpan) cantidadSpan.textContent = cant;
        if (cant === 0) {
          if (contadorBox) contadorBox.classList.add('d-none');
          if (btnAgregar) btnAgregar.classList.remove('d-none');
        }
      });
    }
  });
}

function getCantidad(id) {
  const item = carrito.find(p => p.id == id);
  return item ? item.cantidadCompra : 0;
}

// Agregar al carrito
function agregarAlCarrito(id) {
  let item = carrito.find(p => p.id == id);
  if (!item) {
    const prod = productos.find(p => p.id == id);
    carrito.push({ ...prod, cantidadCompra: 1 });
  } else {
    if (item.cantidadCompra < item.cantidad) {
      item.cantidadCompra++;
    }
  }
  guardarCarrito();
}

// Restar en el carrito
function restarCarrito(id) {
  let item = carrito.find(p => p.id == id);
  if (!item) return;
  item.cantidadCompra--;
  if (item.cantidadCompra === 0) {
    carrito = carrito.filter(p => p.id != id);
  }
  guardarCarrito();
}

// Guardar en el carrito
function guardarCarrito() {
  fetch('http://localhost:8080/carrito', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carrito)
  }).catch(error => {
    console.warn('Backend no disponible, guardando en localStorage:', error);
    localStorage.setItem('carrito', JSON.stringify(carrito));
  });
  actualizarCarrito();
}

// Actualizar carrito
function actualizarCarrito() {
  carritoContainer.innerHTML = '';
  let total = 0;
  let items = 0;
  carrito.forEach(item => {
    total += item.precio * item.cantidadCompra;
    items += item.cantidadCompra;
    carritoContainer.innerHTML += `
      <div class="d-flex justify-content-between border-bottom p-2">
        <span>${item.titulo} x${item.cantidadCompra}</span>
        <strong>$${item.precio * item.cantidadCompra}</strong>
      </div>
    `;
  });
  subtotal.textContent = `$${total}`;
  contador.textContent = items;
}

btnVaciar.addEventListener('click', () => {
  carrito = [];
  guardarCarrito();
});

// Carga inicial desde backend
cargarProductos();


const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
const navPerfil = document.getElementById('navPerfil'); 
const navLogout = document.getElementById('navLogout');
const navLogin = document.getElementById('navLogin');

if (!usuario) {
  if (navPerfil) navPerfil.style.display = 'none';
  if (navLogout) navLogout.style.display = 'none';
} else {
  if (navLogin) navLogin.style.display = 'none';
  if (usuario.rol !== 'admin') {
    if (navPerfil) navPerfil.style.display = 'none';
  }
}
