
const pantallaInicial = document.getElementById("pantalla-inicial");
const contenido = document.getElementById("contenido");
const botonEntrar = document.getElementById("entrar");

const cancion = document.getElementById("cancion");
const botonMusica = document.getElementById("boton-musica");
const disco = document.getElementById("disco");
const progreso = document.getElementById("progreso");

const carrusel = document.getElementById("carrusel");
const anterior = document.getElementById("anterior");
const siguiente = document.getElementById("siguiente");

const botonSorpresa = document.getElementById("sorpresa-final");
const mensajeFinal = document.getElementById("mensaje-final");

let musicaIntentada = false;

// Intentar reproducir al entrar a la página.
// El navegador puede bloquear el audio automático.
async function reproducirMusica() {
  try {
    await cancion.play();
    musicaIntentada = true;
    actualizarReproductor();
  } catch (error) {
    musicaIntentada = false;
    actualizarReproductor();
  }
}

// Estado visual del reproductor
function actualizarReproductor() {
  if (cancion.paused) {
    botonMusica.textContent = "▶";
    botonMusica.setAttribute("aria-label", "Reproducir canción");
    disco.classList.remove("sonando");
  } else {
    botonMusica.textContent = "Ⅱ";
    botonMusica.setAttribute("aria-label", "Pausar canción");
    disco.classList.add("sonando");
  }
}

// Intentar iniciar el audio al cargar.
// Si no está disponible, la página seguirá funcionando.
window.addEventListener("load", () => {
  reproducirMusica();
});

// Abrir el regalo y volver a intentar activar el audio.
botonEntrar.addEventListener("click", async () => {
  pantallaInicial.classList.add("oculto");
  contenido.classList.remove("oculto");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (cancion.paused) {
    await reproducirMusica();
  }
});

// Botón de reproducir y pausar
botonMusica.addEventListener("click", async () => {
  if (cancion.paused) {
    await reproducirMusica();

    if (cancion.paused) {
      alert(
        "No se pudo reproducir la canción. Comprueba que el archivo audio/te-quiero.mp3 exista y sea compatible."
      );
    }
  } else {
    cancion.pause();
  }
});

cancion.addEventListener("play", actualizarReproductor);
cancion.addEventListener("pause", actualizarReproductor);
cancion.addEventListener("ended", actualizarReproductor);

// Barra de progreso de la canción
cancion.addEventListener("timeupdate", () => {
  if (
    Number.isFinite(cancion.duration) &&
    cancion.duration > 0
  ) {
    const porcentaje =
      (cancion.currentTime / cancion.duration) * 100;

    progreso.style.width = `${porcentaje}%`;
  }
});

cancion.addEventListener("ended", () => {
  progreso.style.width = "0%";
});

// Carrusel de fotos
function moverCarrusel(direccion) {
  const foto = carrusel.querySelector(".foto");

  if (!foto) return;

  const espacio = foto.getBoundingClientRect().width + 20;

  carrusel.scrollBy({
    left: espacio * direccion,
    behavior: "smooth"
  });
}

anterior.addEventListener("click", () => {
  moverCarrusel(-1);
});

siguiente.addEventListener("click", () => {
  moverCarrusel(1);
});

// Corazones flotantes
const contenedorCorazones = document.getElementById("corazones");
const simbolos = ["♡", "♥", "💜", "✧"];

function crearCorazon() {
  // No crear animaciones si la pestaña está oculta.
  if (document.hidden) return;

  const corazon = document.createElement("span");

  corazon.className = "corazon-flotante";
  corazon.textContent =
    simbolos[Math.floor(Math.random() * simbolos.length)];

  corazon.style.left = `${Math.random() * 100}vw`;
  corazon.style.fontSize = `${12 + Math.random() * 15}px`;
  corazon.style.animationDuration = `${7 + Math.random() * 6}s`;

  contenedorCorazones.appendChild(corazon);

  window.setTimeout(() => {
    corazon.remove();
  }, 14000);
}

window.setInterval(crearCorazon, 1100);

// Sorpresa final
botonSorpresa.addEventListener("click", () => {
  const estaOculto = mensajeFinal.classList.contains("oculto");

  mensajeFinal.classList.toggle("oculto");

  botonSorpresa.textContent = estaOculto
    ? "Cerrar mi sorpresita ♡"
    : "Una última cosita para ti… 💜";

  if (estaOculto) {
    mensajeFinal.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
});

// Mostrar un aviso si el audio no carga.
cancion.addEventListener("error", () => {
  actualizarReproductor();
  console.warn(
    "No se pudo cargar el audio. Revisa la ruta audio/te-quiero.mp3."
  );
});

// Avisar en consola si alguna fotografía no carga.
document.querySelectorAll(".foto img, .portada-musica").forEach((imagen) => {
  imagen.addEventListener("error", () => {
    console.warn(`No se pudo cargar la imagen: ${imagen.getAttribute("src")}`);
  });
});
