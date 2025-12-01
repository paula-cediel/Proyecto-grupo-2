<script>
    const seleccionados = document.getElementById('seleccionados');

    // Espera a que los productos de tu compañero existan
    document.addEventListener('click', (e) => {
        if (e.target.closest('.producto')) {
            const prod = e.target.closest('.producto');

            // Marcar el producto original
            prod.classList.add('seleccionado');

            // Clonar producto seleccionado
            const copia = prod.cloneNode(true);
            copia.classList.remove('seleccionado');

            // Enviar a la sección de seleccionados
            seleccionados.appendChild(copia);
        }
    });
</script>
