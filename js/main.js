document.addEventListener("DOMContentLoaded", function() {
    // Referencias a los elementos del DOM
    const reproduciendo = document.getElementById("temaReproduciendo"); // Elemento de audio
    const botonPlay = document.getElementById("botonPlay"); // Botón de reproducir
    const botonPausa = document.getElementById("botonPausa"); // Botón de pausa
    const botonSiguiente = document.getElementById("botonSiguiente"); // Botón siguiente
    const botonAnterior = document.getElementById("botonAnterior"); // Botón anterior
    const infoTema = document.getElementById("infoTema"); // Elemento para mostrar información de la canción
    const buscador = document.getElementById("buscador"); // Campo de búsqueda
    const buscarBtn = document.getElementById("buscarBtn"); // Botón de búsqueda
    const reproductor = document.getElementById("reproductor"); // Contenedor del reproductor
    const barraProgreso = document.getElementById("barraProgreso"); // Barra de progreso

    // Playlist inicial
    let playlist = [
        { title: "Hozier - Too Sweet", src: "./audios/Hozier_-_Too_Sweet_Official_Video_[_YouConvert.net_]" },
        { title: "Katy Perry - Dark Horse", src: "./audios/Katy_Perry_-_Dark_Horse_ft_Juicy_J_[_YouConvert.net_]" },
        { title: "Tove Lo - Busy Girl", src: "./audios/Tove_Lo_SG_Lewis_-_Busy_Girl_Official_Music_Video_[_YouConvert.net_]" }
    ];

    // Cargar la playlist desde LocalStorage si existe
    if (localStorage.getItem("playlist")) {
        playlist = JSON.parse(localStorage.getItem("playlist"));
    } else {
        // Guardar la playlist inicial en LocalStorage
        localStorage.setItem("playlist", JSON.stringify(playlist));
    }

    let cancionActual = 0; // Índice de la canción actual

    // Función para cargar la canción en el reproductor
    function cargarCancion(index) {
        if (index >= 0 && index < playlist.length) {
            reproduciendo.src = playlist[index].src; // Establecer la fuente de audio
            infoTema.textContent = `Reproduciendo: ${playlist[index].title}`; // Actualizar información de la canción
            mensaje.textContent = ""; // Limpiar mensaje de error
        } else {
            mensaje.textContent = "Cancion no valida"; // Mostrar mensaje de error
        }
    }

    // Función para alternar entre los botones de play y pausa
    function togglePlayPause(isPlaying) {
        if (isPlaying) {
            botonPlay.style.display = 'none'; // Ocultar botón de play
            botonPausa.style.display = 'inline'; // Mostrar botón de pausa
        } else {
            botonPlay.style.display = 'inline'; // Mostrar botón de play
            botonPausa.style.display = 'none'; // Ocultar botón de pausa
        }
    }

    // Función para mostrar el reproductor
    function showReproductor() {
        reproductor.style.display = 'block';
    }

    // Función para actualizar la barra de progreso
    function updateProgressBar() {
        const percentage = (reproduciendo.currentTime / reproduciendo.duration) * 100;
        barraProgreso.value = percentage; // Establecer el valor de la barra de progreso
    }

    // Función de orden superior: map
    // Renderizar las playlists en el DOM
    function renderPlaylists() {
        const playlistContainer = document.getElementById("playlists");
        playlistContainer.innerHTML = ""; // Limpiar contenido previo
        playlist.map((item, index) => {
            const playlistElement = document.createElement("div"); // Crear nuevo div para la playlist
            playlistElement.classList.add("playlist"); // Añadir clase
            playlistElement.dataset.index = index; // Establecer el índice en el data-attribute
            playlistElement.innerHTML = `<h3>${item.title}</h3>`; // Añadir título de la canción
            playlistElement.addEventListener("click", function() {
                cancionActual = index; // Actualizar la canción actual
                cargarCancion(cancionActual); // Cargar la nueva canción
                reproduciendo.play(); // Reproducir la canción
                showReproductor(); // Mostrar el reproductor
                togglePlayPause(true); // Mostrar el botón de pausa
            });
            playlistContainer.appendChild(playlistElement); // Añadir el div al contenedor de playlists
        });
    }

    // Controlador del botón de reproducir
    botonPlay.addEventListener("click", function() {
        reproduciendo.play(); // Reproducir la canción
        togglePlayPause(true); // Mostrar el botón de pausa
    });

    // Controlador del botón de pausa
    botonPausa.addEventListener("click", function() {
        reproduciendo.pause(); // Pausar la canción
        togglePlayPause(false); // Mostrar el botón de play
    });

    // Controlador del botón de siguiente
    botonSiguiente.addEventListener("click", function() {
        if (cancionActual < playlist.length - 1) {
            cancionActual++; // Avanzar al siguiente índice
        } else {
            cancionActual = 0; // Volver al inicio de la playlist
        }
        cargarCancion(cancionActual); // Cargar la nueva canción
        reproduciendo.play(); // Reproducir la canción
        togglePlayPause(true); // Mostrar el botón de pausa
    });

    // Controlador del botón de anterior
    botonAnterior.addEventListener("click", function() {
        if (cancionActual > 0) {
            cancionActual--; // Retroceder al índice anterior
        } else {
            cancionActual = playlist.length - 1; // Ir al final de la playlist
        }
        cargarCancion(cancionActual); // Cargar la nueva canción
        reproduciendo.play(); // Reproducir la canción
        togglePlayPause(true); // Mostrar el botón de pausa
    });

    // Actualizar la barra de progreso mientras se reproduce la canción
    reproduciendo.addEventListener("timeupdate", updateProgressBar);

    // Controlador para la barra de progreso
    barraProgreso.addEventListener("input", function() {
        const newTime = (barraProgreso.value / 100) * reproduciendo.duration;
        reproduciendo.currentTime = newTime; // Establecer el tiempo actual de la canción según la barra de progreso
    });

    // Función de orden superior: filter
    // Controlador del botón de búsqueda
    buscarBtn.addEventListener("click", function() {
        const query = buscador.value.toLowerCase(); // Obtener la consulta en minúsculas
        const resultados = playlist.filter(item => item.title.toLowerCase().includes(query)); // Filtrar canciones que coincidan con la consulta
        if (resultados.length > 0) {
            cancionActual = playlist.indexOf(resultados[0]); // Establecer la canción actual a la primera coincidencia
            cargarCancion(cancionActual); // Cargar la nueva canción
            reproduciendo.play(); // Reproducir la canción
            showReproductor(); // Mostrar el reproductor
            togglePlayPause(true); // Mostrar el botón de pausa
            mensaje.textContent = ""; // Limpiar mensaje de error
        } else {
            mensaje.textContent = "No se encontraron resultados"; // Mostrar mensaje de error
        }
    });

    // Inicializar el primer tema
    cargarCancion(cancionActual);
    togglePlayPause(false);
    renderPlaylists(); // Renderizar las playlists en el DOM
});