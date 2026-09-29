/**
 * LÓGICA DE CONTROL OPTIMIZADA
 * Carga metadatos de configuración y parsea libros desde archivos de texto plano.
 */

// Estado global de la aplicación
let bibliotecaConfig = null;

// Referencias a elementos del DOM
const bookSelector = document.getElementById('book-selector');
const chaptersList = document.getElementById('chapters-list');
const chapterTitle = document.getElementById('chapter-title');
const chapterContent = document.getElementById('chapter-content');
const chatbotContainer = document.getElementById('chatbot-container');

// 1. Carga inicial del archivo de configuración (metadatos)
console.log("Iniciando aplicación: Cargando configuración de libros...");
fetch('books.json')
    .then(response => {
        if (!response.ok) throw new Error(`Error al cargar configuración: ${response.status}`);
        return response.json();
    })
    .then(data => {
        bibliotecaConfig = data;
        console.log("Éxito: Configuración cargada.", bibliotecaConfig);
        initEvents();
    })
    .catch(error => console.error("Fallo crítico en la inicialización:", error));

// 2. Inicialización de escuchadores de eventos
function initEvents() {
    bookSelector.addEventListener('change', (e) => {
        const bookKey = e.target.value;
        console.log(`Evento: Selección de libro -> ${bookKey}`);
        
        if (bookKey && bibliotecaConfig[bookKey]) {
            descargarYParsearLibro(bookKey);
        } else {
            resetPantalla();
        }
    });
}

// 3. Descarga el archivo .txt del libro y lo estructura en memoria de forma dinámica
function descargarYParsearLibro(key) {
    const libroInfo = bibliotecaConfig[key];
    console.log(`Petición: Descargando texto plano desde -> ${libroInfo.archivo}`);

    fetch(libroInfo.archivo)
        .then(response => {
            if (!response.ok) throw new Error(`No se encontró el archivo de texto: ${libroInfo.archivo}`);
            return response.text(); // Leemos el archivo como texto plano, no como JSON
        })
        .then(textoCompleto => {
            console.log(`Éxito: Archivo descargado. Tamaño: ${textoCompleto.length} caracteres. Iniciando parseo...`);
            
            // Parsear el texto plano buscando la etiqueta [CAPITULO]
            const capitulosParseados = parsearTextoALibro(textoCompleto);
            
            if (capitulosParseados.length === 0) {
                throw new Error("El archivo de texto no contiene ninguna etiqueta [CAPITULO] válida.");
            }

            // Renderizar la interfaz con los datos ya estructurados
            renderizarIndice(capitulosParseados, libroInfo);
        })
        .catch(error => {
            console.error(`Error procesando el libro [${libroInfo.titulo}]:`, error);
            alert("No se pudo cargar el cuerpo del libro. Revisa la consola.");
        });
}

/**
 * 4. PARSEADOR DE TEXTO (Motor del cambio)
 * Toma el bloque de texto gigante y lo divide en un array de objetos de capítulos.
 */
function parsearTextoALibro(texto) {
    const bloques = texto.split('[CAPITULO]');
    const capitulos = [];

    bloques.forEach(bloque => {
        const bloqueLimpio = bloque.trim();
        if (!bloqueLimpio) return; // Ignorar bloques vacíos (como el espacio antes del primer [CAPITULO])

        // Separamos la primera línea (que será el título) del resto del texto (el contenido)
        const lineas = bloqueLimpio.split('\n');
        const tituloCapitulo = lineas[0].trim();
        const contenidoCapitulo = lineas.slice(1).join('\n').trim();

        capitulos.push({
            titulo: tituloCapitulo,
            contenido: contenidoCapitulo
        });
    });

    console.log(`Parseo finalizado: Se detectaron ${capitulos.length} capítulos.`);
    return capitulos;
}

// 5. Renderiza el índice de capítulos en la barra lateral
function renderizarIndice(capitulos, libroInfo) {
    chaptersList.innerHTML = '';
    
    capitulos.forEach((capitulo) => {
        const li = document.createElement('li');
        li.textContent = capitulo.titulo;
        li.addEventListener('click', () => mostrarCapitulo(capitulo));
        chaptersList.appendChild(li);
    });

    // Cargar por defecto el primer capítulo
    mostrarCapitulo(capitulos[0]);

    // Actualizar el widget de Inteligencia Artificial
    actualizarChatbot(libroInfo.chatbotId, libroInfo.titulo);
}

// 6. Muestra el texto del capítulo seleccionado en el área de lectura
function mostrarCapitulo(capitulo) {
    console.log(`Lector: Cambiando al capítulo -> ${capitulo.titulo}`);
    chapterTitle.textContent = capitulo.titulo;
    
    // Reemplazamos los saltos de línea (\n) por etiquetas <p> para mantener los párrafos en HTML
    const parrafosHtml = capitulo.contenido
        .split('\n\n')
        .map(parrafo => `<p>${parrafo.trim()}</p>`)
        .join('');

    chapterContent.innerHTML = parrafosHtml;
}

// 7. Simulación de inyección del Chatbot de IA
function actualizarChatbot(chatbotId, tituloLibro) {
    console.log(`IA: Configurando bot para [${tituloLibro}] con ID: ${chatbotId}`);
    chatbotContainer.innerHTML = '';

    const scriptIA = document.createElement('script');
    scriptIA.src = "https://cdn.plataformachatbot.com/widget.js";
    scriptIA.setAttribute('data-chat-id', chatbotId);
    scriptIA.defer = true;

    scriptIA.onerror = () => {
        console.warn(`Simulación: Script de IA preparado para el ID de ${tituloLibro}.`);
    };

    chatbotContainer.appendChild(scriptIA);
}

// 8. Resetea la interfaz
function resetPantalla() {
    console.log("Limpiando lector...");
    chaptersList.innerHTML = '<li class="placeholder-text">Selecciona un libro para ver sus capítulos</li>';
    chapterTitle.textContent = "Bienvenido";
    chapterContent.innerHTML = '<p>Por favor, selecciona un libro del menú superior para comenzar la lectura.</p>';
    chatbotContainer.innerHTML = '';
}