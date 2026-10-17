/**
 * LÓGICA DE CONTROL OPTIMIZADA - APUNTES TAIS
 * Carga metadatos de configuración y parsea ficheros de texto plano.
 */

// Estado global de la aplicación
var bibliotecaConfig = null;

// Referencias a elementos del DOM
var bookSelector = document.getElementById("book-selector");
var chaptersList = document.getElementById("chapters-list");
var chapterTitle = document.getElementById("chapter-title");
var chapterContent = document.getElementById("chapter-content");
var chatbotContainer = document.getElementById("chatbot-container");

// 1. Carga inicial del archivo de configuración (metadatos)
console.log("[Init] Cargando configuración de temas desde 'books.json'...");
fetch("books.json")
    .then(function(response) {
        if (!response.ok) {
            console.error("[Init Error] Estado HTTP no válido: " + response.status);
            throw new Error("Error al cargar configuración: " + response.status);
        }
        return response.json();
    })
    .then(function(data) {
        bibliotecaConfig = data;
        console.log("[Init Éxito] Configuración cargada correctamente:", bibliotecaConfig);
        initEvents();
        
        // AUTO-CARGA INICIAL: Si ya hay un valor seleccionado en el desplegable, cargarlo automáticamente
        if (bookSelector.value && bibliotecaConfig[bookSelector.value]) {
            console.log("[Init Auto-load] Cargando tema seleccionado por defecto -> " + bookSelector.value);
            descargarYParsearLibro(bookSelector.value);
        }
    })
    .catch(function(error) {
        console.error("[Init Fallo Crítico] No se pudo inicializar la aplicación:", error);
    });

// 2. Inicialización de escuchadores de eventos
function initEvents() {
    console.log("[Eventos] Registrando escuchadores del DOM...");
    bookSelector.addEventListener("change", function(e) {
        var bookKey = e.target.value;
        console.log("[Evento Change] Selección de tema detectada -> Clave: " + bookKey);
        
        if (bookKey && bibliotecaConfig[bookKey]) {
            descargarYParsearLibro(bookKey);
        } else {
            console.warn("[Evento Change] Clave no válida o no encontrada en la configuración.");
            resetPantalla();
        }
    });
}

// 3. Descarga el archivo .txt del tema y lo estructura en memoria
function descargarYParsearLibro(key) {
    var libroInfo = bibliotecaConfig[key];
    console.log("[Descarga] Iniciando petición Fetch hacia -> " + libroInfo.archivo);

    fetch(libroInfo.archivo)
        .then(function(response) {
            if (!response.ok) {
                console.error("[Descarga Error] No se encontró el fichero: " + libroInfo.archivo + " (HTTP " + response.status + ")");
                throw new Error("No se encontró el archivo de texto: " + libroInfo.archivo);
            }
            return response.text();
        })
        .then(function(textoCompleto) {
            console.log("[Descarga Éxito] Tamaño recibido: " + textoCompleto.length + " caracteres. Iniciando parseo...");
            
            var capitulosParseados = parsearTextoALibro(textoCompleto);
            
            if (capitulosParseados.length === 0) {
                console.error("[Parseo Error] El archivo no contiene la etiqueta delimitadora [CAPITULO]");
                throw new Error("El archivo de texto no contiene ninguna etiqueta [CAPITULO] válida.");
            }

            renderizarIndice(capitulosParseados, libroInfo);
        })
        .catch(function(error) {
            console.error("[Procesamiento Error] Fallo al procesar tema:", error);
            alert("No se pudo cargar el cuerpo del tema. Revisa la consola para más detalles.");
        });
}

/**
 * 4. PARSEADOR DE TEXTO
 * Divide el bloque de texto en un array de objetos según el delimitador [CAPITULO].
 */
function parsearTextoALibro(texto) {
    console.log("[Parseo] Dividiendo texto en bloques...");
    var bloques = texto.split("[CAPITULO]");
    var capitulos = [];

    bloques.forEach(function(bloque, index) {
        var bloqueLimpio = bloque.trim();
        if (!bloqueLimpio) {
            console.log("[Parseo] Omitiendo bloque vacío en índice " + index);
            return;
        }

        var lineas = bloqueLimpio.split("\n");
        var tituloCapitulo = lineas[0].trim();
        var contenidoCapitulo = lineas.slice(1).join("\n").trim();

        capitulos.push({
            titulo: tituloCapitulo,
            contenido: contenidoCapitulo
        });
    });

    console.log("[Parseo Éxito] Se extrajeron " + capitulos.length + " capítulos/secciones.");
    return capitulos;
}

// 5. Renderiza el índice de capítulos en la barra lateral
function renderizarIndice(capitulos, libroInfo) {
    console.log("[UI] Generando elementos para el índice lateral...");
    limpiarElementoDOM(chaptersList);
    
    capitulos.forEach(function(capitulo, index) {
        var li = document.createElement("li");
        li.textContent = capitulo.titulo;
        li.addEventListener("click", function() {
            console.log("[UI Interaction] Clic en tema del índice -> Índice: " + index);
            mostrarCapitulo(capitulo);
        });
        chaptersList.appendChild(li);
    });

    console.log("[UI] Cargando automáticamente el primer capítulo...");
    mostrarCapitulo(capitulos[0]);

    actualizarChatbot(libroInfo.chatbotId, libroInfo.titulo);
}


/**
 * 6. FORMATADOR Y VISUALIZADOR DE CONTENIDO
 * Convierte el texto en nodos DOM con soporte para código, listas y párrafos.
 */
function mostrarCapitulo(capitulo) {
    console.log("[Lector] Renderizando capítulo actual: " + capitulo.titulo);
    chapterTitle.textContent = capitulo.titulo;
    limpiarElementoDOM(chapterContent);
    
    var bloques = capitulo.contenido.split("\n\n");

    bloques.forEach(function(bloque, idx) {
        var bloqueLimpio = bloque.trim();

        // Caso 0: Bloques de código formateados [CODIGO] ... [/CODIGO]
        if (bloqueLimpio.indexOf("[CODIGO]") === 0 && bloqueLimpio.indexOf("[/CODIGO]") !== -1) {
            console.log("[Lector/Formatter] Bloque " + idx + ": Caja de código detectada.");
            var codigoTexto = bloqueLimpio.replace("[CODIGO]", "").replace("[/CODIGO]", "").trim();

            var contenedorCodigo = document.createElement("div");
            contenedorCodigo.className = "codigo-contenedor";

            var btnCopiar = document.createElement("button");
            btnCopiar.className = "btn-copiar";
            btnCopiar.textContent = "Copiar";
            btnCopiar.addEventListener("click", function() {
                navigator.clipboard.writeText(codigoTexto).then(function() {
                    btnCopiar.textContent = "¡Copiado!";
                    setTimeout(function() { btnCopiar.textContent = "Copiar"; }, 2000);
                });
            });

            var pre = document.createElement("pre");
            var code = document.createElement("code");
            code.textContent = codigoTexto;
            pre.appendChild(code);

            contenedorCodigo.appendChild(btnCopiar);
            contenedorCodigo.appendChild(pre);
            chapterContent.appendChild(contenedorCodigo);
            return;
        }

        var lineas = bloqueLimpio.split("\n");

        // Caso 1: Lista desordenada (líneas que empiezan con guion)
        if (lineas.every(function(l) { return l.trim().indexOf("-") === 0; })) {
            console.log("[Lector/Formatter] Bloque " + idx + ": Lista desordenada.");
            var ul = document.createElement("ul");
            lineas.forEach(function(linea) {
                var li = document.createElement("li");
                li.textContent = linea.trim().substring(1).trim();
                ul.appendChild(li);
            });
            chapterContent.appendChild(ul);
            return;
        }

        // Caso 2: Lista ordenada (líneas que empiezan con número y punto ej. 1.)
        if (lineas.every(function(l) { return /^\d+\./.test(l.trim()); })) {
            console.log("[Lector/Formatter] Bloque " + idx + ": Lista ordenada.");
            var ol = document.createElement("ol");
            lineas.forEach(function(linea) {
                var li = document.createElement("li");
                li.textContent = linea.trim().replace(/^\d+\./, "").trim();
                ol.appendChild(li);
            });
            chapterContent.appendChild(ol);
            return;
        }

        // Caso 3: Subtítulo (línea única terminada en dos puntos)
        if (lineas.length === 1 && lineas[0].endsWith(":")) {
            console.log("[Lector/Formatter] Bloque " + idx + ": Subtítulo -> " + lineas[0]);
            var h3 = document.createElement("h3");
            h3.textContent = lineas[0];
            chapterContent.appendChild(h3);
            return;
        }

        // Caso 4: Párrafo estándar con saltos de línea simples
        var p = document.createElement("p");
        lineas.forEach(function(linea, lineIdx) {
            p.appendChild(document.createTextNode(linea));
            if (lineIdx < lineas.length - 1) {
                p.appendChild(document.createElement("br"));
            }
        });
        chapterContent.appendChild(p);
    });

    console.log("[Lector Éxito] Contenido renderizado correctamente en el DOM.");
}

// 7. Configuración e inyección del Chatbot de IA
function actualizarChatbot(chatbotId, tituloLibro) {
    console.log("[IA Integración] Cargando script del chatbot para " + tituloLibro + " (ID: " + chatbotId + ")...");
    limpiarElementoDOM(chatbotContainer);

    var scriptIA = document.createElement("script");
    scriptIA.src = "https://cdn.plataformachatbot.com/widget.js";
    scriptIA.setAttribute("data-chat-id", chatbotId);
    scriptIA.defer = true;

    scriptIA.onload = function() {
        console.log("[IA Integración] Script de IA cargado con éxito.");
    };
    scriptIA.onerror = function() {
        console.warn("[IA Integración Warning] No se pudo conectar con el chatbot ID: " + chatbotId);
    };

    chatbotContainer.appendChild(scriptIA);
}

// 8. Resetea la interfaz a su estado inicial
function resetPantalla() {
    console.log("[UI] Restableciendo estado inicial de la pantalla...");
    
    limpiarElementoDOM(chaptersList);
    var liPlaceholder = document.createElement("li");
    liPlaceholder.className = "placeholder-text";
    liPlaceholder.textContent = "Selecciona un tema para ver sus capítulos";
    chaptersList.appendChild(liPlaceholder);

    chapterTitle.textContent = "Bienvenido";
    
    limpiarElementoDOM(chapterContent);
    var pBienvenida = document.createElement("p");
    pBienvenida.textContent = "Por favor, selecciona un tema del menú superior para comenzar la lectura.";
    chapterContent.appendChild(pBienvenida);

    limpiarElementoDOM(chatbotContainer);
}

// Función auxiliar reutilizable para vaciar nodos DOM
function limpiarElementoDOM(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}