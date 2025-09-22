//Script.js

document.addEventListener("DOMContentLoaded", function () {
    const images = [
        {
            title: "image 1",
            description: "image 1 description",
            url: "image/Amanecer entre Montañas.jpg",
        },
        {
            title: "image 2",
            description: "image 2 description",
            url: "image/Calle-antigua-iluminada.png",
        },
        {
            title: "image 3",
            description: "image 3 description",
            url: "image/Ciudad en Llamas.jpg",
        },
        {
            title: "image 4",
            description: "image 4 description",
            url: "image/Danza Cósmica.jpg",
        },
        {
            title: "image 5",
            description: "image 5 description",
            url: "image/Danza Cósmica2.jpg",
        },
        {
            title: "image 6",
            description: "image 6 description",
            url: "image/La travesía lunar.jpg",
        },
        {
            title: "image 7",
            description: "image 7 description",
            url: "image/Luz de Luna entre Montañas y Flores.jpg",
        },
        {
            title: "image 8",
            description: "image 8 description",
            url: "image/Noche Lluviosa en el Puerto.jpg",
        },
        {
            title: "image 9",
            description: "image 9 description",
            url: "image/Pared Agrietada.jpg",
        },
        {
            title: "image 10",
            description: "image 10 description",
            url: "image/Serenidad Acuática.jpg",
        },
    ];
    
    const galleryContainer = document.getElementById("gallery");

let currentIndex = 0; // Variable para rastrear la imagen actual

// Función para mostrar la imagen actual
function showImage(index) {
    // Remueve la clase 'focused' de todas las imágenes
    document.querySelectorAll("#gallery img").forEach((img) => {
        img.classList.remove("focused");
    });

    // Agrega la clase 'focused' a la imagen correspondiente
    const imgElements = document.querySelectorAll("#gallery img");
    imgElements[index].classList.add("focused");

    // Actualiza el índice actual
    currentIndex = index;

    // Actualiza la imagen de portada
    const portadaImage = document.querySelector(".portada img");
    portadaImage.src = images[index].url;
}

// Función para cambiar a la siguiente imagen
function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
}

// Función para cambiar a la imagen anterior
function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
}

// Itera sobre el arreglo de imágenes y crea elementos HTML
images.forEach((image, index) => {
    // Crea un elemento de imagen
    const imgElement = document.createElement("img");
    imgElement.src = image.url;

    // Agrega un controlador de eventos de clic a la imagen
    imgElement.addEventListener("click", () => {
        showImage(index);
    });

    // Crea un contenedor para la imagen y la descripción
    const container = document.createElement("div");
    container.appendChild(imgElement);

    // Agrega el contenedor al contenedor principal de la galería
    galleryContainer.appendChild(container);
});

// Agrega controladores de eventos a los botones "prev" y "next"
document.querySelector(".prev").addEventListener("click", prevImage);
document.querySelector(".next").addEventListener("click", nextImage);


// Muestra la imagen inicial
showImage(0);
})