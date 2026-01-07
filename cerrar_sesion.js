// Boton cerrar sesión
document.addEventListener("DOMContentLoaded", () => {
  const btnLogout = document.getElementById("btn_cerrar_sesion");
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  const usuarioActual = JSON.parse(localStorage.getItem("usuarioActivo"));
  const saludo = document.getElementById("saludo")
  

  // Mostrar u ocultar botón
  if (usuarioActivo && btnLogout) {
    saludo.textContent =  `Hola, ${usuarioActual.nombre} `
    btnLogout.style.display = "inline-block";
  }else{
    saludo.textContent = "";
    btnLogout.style.display = "none";
  }

  // Cerrar sesión
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      //Limpiar usuario activo
      localStorage.removeItem("usuarioActivo");

      //limpiar carrito
      localStorage.removeItem("carrito");

      //llevar al home
      window.location.href = "/home/home.html";
    });
  }
});