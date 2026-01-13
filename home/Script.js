// Productos de ejemplo
const productos = [
    { id: 1, nombre: "Medias 1", precio: 80000, img: "https://terret.co/cdn/shop/files/MediasTobillerasAqua_940x.png?v=1760122790" },
    { id: 2, nombre: "Medias 2", precio: 120000, img: "https://terret.co/cdn/shop/files/MediasTobillerasAqua_940x.png?v=1760122790" },
    { id: 3, nombre: "Medias 3", precio: 150000, img: "https://terret.co/cdn/shop/files/MediasTobillerasAqua_940x.png?v=1760122790" },
    { id: 4, nombre: "Medais 4", precio: 200000, img: "https://terret.co/cdn/shop/files/MediasTobillerasAqua_940x.png?v=1760122790" },
    { id: 5, nombre: "Gafas MTB", precio: 80000, img: "https://contents.mediadecathlon.com/p2863733/1cr1/k$825a4f45a3e46f9c781be08bbbad0d3c/gafas-de-ciclismo-roadr-900-perf-light-pack-negro.jpg?format=auto&f=512x0" },
    { id: 6, nombre: "Bicicleta de ruta", precio: 120000, img: "https://contents.mediadecathlon.com/p2494036/1cr1/k$132f517bf83cd299044a20a2caec01c6/bicicleta-de-ruta-ncr-cf-van-rysel-tiagra-azul.jpg?format=auto&f=512x0" },
    { id: 7, nombre: "Casco MTB", precio: 150000, img: "https://contents.mediadecathlon.com/p2838941/1cr1/k$422d1b326b534a55dd84533d4c378512/casco-de-ciclismo-mtb-rockrider-st-500-rojo.jpg?format=auto&f=512x0" },
    { id: 8, nombre: "Bicicleta MTB", precio: 200000, img: "https://contents.mediadecathlon.com/p2623121/1cr1/k$26107bef9e486007de7a3cb0a25961f0/bicicleta-mtb-rockrider-race740.jpg?format=auto&f=512x0" },
    { id: 9, nombre: "Aletas de natacion", precio: 80000, img: "https://contents.mediadecathlon.com/p1128370/1cr1/k$2b43d0e5d3329b64d738ce870a6bfdce/aletas-natacion-cortas-nabaiji-silifins.jpg?format=auto&f=512x0" },
    { id: 10, nombre: "Gafas de natacion", precio: 120000, img: "https://contents.mediadecathlon.com/p1767311/1cr1/k$78355c9909d144af2de72781c85b42c6/gafas-natacion-careta-lentes-espejo-active-talla-l.jpg?format=auto&f=512x0" },
    { id: 11, nombre: "Snorkel frontal", precio: 150000, img: "https://contents.mediadecathlon.com/p1789770/1cr1/k$5cfc02a37157eb027ec2c64b3a83f841/snorkel-frontal-natacion-500-talla-s-nabaiji.jpg?format=auto&f=512x0" },
    { id: 12, nombre: "Gorro de natación", precio: 200000, img: "https://contents.mediadecathlon.com/p2637135/1cr1/k$2f605367b9d3a7cb92ad5c533b202e70/gorro-natacion-silicona-estampado-nabaiji.jpg?format=auto&f=512x0" },
    { id: 13, nombre: "Tenis de running", precio: 80000, img: "https://contents.mediadecathlon.com/p2393879/1cr1/k$7381c387cab1b4cd3758d8e1de71f2be/tenis-running-hombre-jogflow-negro.jpg?format=auto&f=512x0" },
    { id: 14, nombre: "Buzo de running", precio: 120000, img: "https://contents.mediadecathlon.com/p2049013/1cr1/k$bfc18e8417d97783ffa1970178d5a0d4/camiseta-para-correr-termica-mujer-run-warm-negro.jpg?format=auto&f=512x0" },
    { id: 15, nombre: "Cinturon de hidratación", precio: 150000, img: "https://contents.mediadecathlon.com/p1918659/1cr1/k$f2360a3dc6ed3e801ae5f70d27f34447/cinturon-trail-running-portabotella-500ml.jpg?format=auto&f=512x0" },
    { id: 16, nombre: "Guantes de running", precio: 200000, img: "https://contents.mediadecathlon.com/p2514033/1cr1/k$4c6f81afd5ffd829913e842448a084c0/guantes-tactiles-running-warm-100-v2-negro.jpg?format=auto&f=512x0" }
];

// Renderizar productos
document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-carrusel");

    let html = "";
    let contador = 0;

    productos.forEach((prod, index) => {
        if (contador === 0) {
            html += `
            <div class="carousel-item ${index === 0 ? "active" : ""}">
                <div class="row">`;
        }

        html += `
        <div class="col-md-3">
            <div class="card">
                <img src="${prod.img}" class="card-img-top">
                <div class="card-body text-center">
                    <h5>${prod.nombre}</h5>
                    <p>$${prod.precio}</p>
                </div>
            </div>
        </div>`;

        contador++;

        if (contador === 4) {
            html += `</div></div>`;
            contador = 0;
        }
    });

    if (contador !== 0) {
        html += `</div></div>`;
    }

    contenedor.innerHTML = html;
});

    const seleccionados = document.getElementById('seleccionados');

    // Espera a que los productos de tu compañero existan

    document.addEventListener('click', (e) => {
        if (e.target.closest('.productos')) {
            const prod = e.target.closest('.productos');

            // Marcar el producto original
            prod.classList.add('seleccionado');

            // Clonar producto seleccionado
            const copia = prod.cloneNode(true);
            copia.classList.remove('seleccionado');

            // Enviar a la sección de seleccionados
            seleccionados.appendChild(copia);
        }
    });
card.querySelector(".like").onclick=()=>{
  const likeBtn = card.querySelector(".like");
  const count = card.querySelector(".like-count");

  if (likeBtn.classList.contains("text-danger")) {
    likeBtn.classList.remove("text-danger");
    count.textContent = Number(count.textContent) - 1;
  } else {
    likeBtn.classList.add("text-danger");
    count.textContent = Number(count.textContent) + 1;
  }
};


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

