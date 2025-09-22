// Variables globales
let currentIndex = 0;
const carouselItems = document.querySelectorAll('.carousel-item');
const totalItems = carouselItems.length;

// Función para mover el carrusel
function moveCarousel(direction) {
    currentIndex += direction;

    // Limitar el índice dentro del rango válido
    if (currentIndex < 0) {
        currentIndex = totalItems - 1;
    } else if (currentIndex >= totalItems) {
        currentIndex = 0;
    }

    // Actualizar la posición del carrusel
    const carousel = document.querySelector('.carousel');
    carousel.style.transform = `translateX(${-currentIndex * 100}%)`;
}

// Desplazamiento suave entre secciones
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

// Mostrar el botón "Volver al Inicio" al hacer scroll
window.addEventListener('scroll', () => {
    const backToTopButton = document.getElementById('back-to-top');
    if (window.pageYOffset > 200) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

// Validación básica del formulario de contacto
document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el envío del formulario
    alert('Formulario enviado correctamente.');
    this.reset(); // Limpiar el formulario
});