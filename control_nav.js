document.addEventListener("DOMContentLoaded", () => {
    const perfil = document.getElementById("navPerfil");
    const registro = document.getElementById("navRegistro");
    const login = document.getElementById("navLogin");
    // const contenedor = document.getElementById("contenido_perfil"); 
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
});
