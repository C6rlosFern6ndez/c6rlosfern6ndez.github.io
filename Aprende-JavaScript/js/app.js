/**
 * Controlador Principal: Coordina el ciclo de vida, la carga de datos, las vistas de la aplicación
 * y añade características avanzadas de experiencia de usuario (Buscador, Copiado y Toasts).
 */

import { obtenerDatosGuia } from './storage.js';
import { configurarAdministrador, alternarModoAdmin } from './admin.js';

// Estado global unificado (Single Source of Truth) para interactuar entre módulos
const contextoApp = {
    estadoGuia: null,
    temaSeleccionadoId: null
};

// Referencias a los elementos clave del DOM
const DOM = {
    sidebarNav: document.querySelector('.sidebar-nav'),
    themeTitle: document.getElementById('theme-title'),
    themeBody: document.getElementById('theme-body')
};

/**
 * Inicializa la aplicación configurando servicios, datos y controladores.
 */
async function inicializarApp() {
    console.log("App: Iniciando ciclo de vida de la aplicación...");
    contextoApp.estadoGuia = await obtenerDatosGuia();
    
    if (!contextoApp.estadoGuia) {
        console.error("App: Error crítico. No se pudieron recuperar los datos del Storage.");
        DOM.themeTitle.textContent = "Error crítico al cargar la guía de programación.";
        return;
    }
    
    // Renderizado del menú y vinculación del controlador de administrador
    renderizarMenuLateral();
    configurarAdministrador(contextoApp, renderizarContenidoTema, renderizarMenuLateral);
    
    console.log("App: Inicialización completada con éxito.");
}

/**
 * Genera dinámicamente el árbol de navegación (Buscador -> Niveles -> Capítulos -> Temas).
 */
function renderizarMenuLateral() {
    console.log("App: Renderizando barra de navegación lateral...");
    
    // Conservar el valor del buscador si el usuario ya estaba escribiendo en él
    const buscadorPrevio = document.getElementById('nav-search-input');
    const valorBusqueda = buscadorPrevio ? buscadorPrevio.value : '';

    DOM.sidebarNav.innerHTML = ''; 

    // Inyección dinámica del buscador en la parte superior del menú lateral
    const contenedorBuscador = document.createElement('div');
    contenedorBuscador.style.padding = '0 0 1.5rem 0';
    
    const buscador = document.createElement('input');
    buscador.id = 'nav-search-input';
    buscador.type = 'text';
    buscador.placeholder = '🔍 Buscar tema por título...';
    buscador.value = valorBusqueda;
    buscador.style.width = '100%';
    buscador.style.padding = '0.75rem';
    buscador.style.borderRadius = '6px';
    buscador.style.border = '1px solid var(--color-border)';
    buscador.style.boxSizing = 'border-box';
    buscador.style.fontSize = '0.9rem';
    buscador.style.backgroundColor = 'var(--color-bg)';
    buscador.style.color = 'var(--color-dark)';
    
    buscador.addEventListener('input', (e) => {
        filtrarTemasMenu(e.target.value.toLowerCase());
    });
    
    contenedorBuscador.appendChild(buscador);
    DOM.sidebarNav.appendChild(contenedorBuscador);

    const niveles = contextoApp.estadoGuia.niveles;

    for (const claveNivel in niveles) {
        const nivel = niveles[claveNivel];
        if (nivel.capitulos.length === 0) continue;

        const tituloNivel = document.createElement('div');
        tituloNivel.className = 'nav-level-title';
        tituloNivel.textContent = nivel.nombre;
        DOM.sidebarNav.appendChild(tituloNivel);

        nivel.capitulos.forEach(capitulo => {
            const tituloCapitulo = document.createElement('h3');
            tituloCapitulo.className = 'nav-chapter-title';
            tituloCapitulo.textContent = capitulo.titulo;
            DOM.sidebarNav.appendChild(tituloCapitulo);

            const listaTemas = document.createElement('ul');
            listaTemas.className = 'nav-theme-list';

            capitulo.temas.forEach(tema => {
                const itemTema = document.createElement('li');
                const enlaceTema = document.createElement('a');
                enlaceTema.className = 'nav-theme-link';
                enlaceTema.textContent = tema.titulo;
                enlaceTema.dataset.id = tema.id;
                
                enlaceTema.addEventListener('click', () => {
                    console.log(`App: Click detectado en el tema ID: ${tema.id}`);
                    cargarTema(tema.id);
                });

                itemTema.appendChild(enlaceTema);
                listaTemas.appendChild(itemTema);
            });

            DOM.sidebarNav.appendChild(listaTemas);
        });
    }

    // Si había un texto de búsqueda previo, reaplicamos el filtro inmediatamente
    if (valorBusqueda) {
        filtrarTemasMenu(valorBusqueda.toLowerCase());
    }
}

/**
 * Filtra en tiempo real los elementos del menú lateral ocultando ramas vacías.
 * @param {string} consulta - Texto de búsqueda introducido por el usuario.
 */
function filtrarTemasMenu(consulta) {
    console.log(`App: Filtrando menú lateral con la consulta: "${consulta}"`);
    const listasTemas = DOM.sidebarNav.querySelectorAll('.nav-theme-list');
    
    listasTemas.forEach(lista => {
        let temasVisibles = 0;
        const items = lista.querySelectorAll('li');
        
        items.forEach(item => {
            const enlace = item.querySelector('.nav-theme-link');
            const coincide = enlace.textContent.toLowerCase().includes(consulta);
            
            item.style.display = coincide ? '' : 'none';
            if (coincide) temasVisibles++;
        });
        
        const tituloCapitulo = lista.previousElementSibling;
        if (tituloCapitulo && tituloCapitulo.tagName === 'H3') {
            tituloCapitulo.style.display = temasVisibles === 0 ? 'none' : '';
        }
        lista.style.display = temasVisibles === 0 ? 'none' : '';
    });
    
    const titulosNivel = DOM.sidebarNav.querySelectorAll('.nav-level-title');
    titulosNivel.forEach(titulo => {
        let tieneContenidoVisible = false;
        let hermano = titulo.nextElementSibling;
        
        while (hermano && !hermano.classList.contains('nav-level-title')) {
            if (hermano.style.display !== 'none' && (hermano.tagName === 'H3' || hermano.classList.contains('nav-theme-list'))) {
                tieneContenidoVisible = true;
            }
            hermano = hermano.nextElementSibling;
        }
        titulo.style.display = tieneContenidoVisible ? '' : 'none';
    });
}

/**
 * Busca un tema específico por su ID y maneja las transiciones de visualización.
 */
function cargarTema(idTema) {
    console.log(`App: Procesando solicitud de carga para el tema: ${idTema}`);
    contextoApp.temaSeleccionadoId = idTema;
    
    const panelAdmin = document.getElementById('admin-mode');
    if (panelAdmin && !panelAdmin.classList.contains('d-none')) {
        console.log("App: Cierre preventivo del modo administrador detectado por cambio de sección.");
        alternarModoAdmin(contextoApp);
    }

    document.querySelectorAll('.nav-theme-link').forEach(link => {
        link.classList.toggle('active', link.dataset.id === idTema);
    });

    let temaEncontrado = null;
    const niveles = contextoApp.estadoGuia.niveles;

    for (const clave in niveles) {
        niveles[clave].capitulos.forEach(cap => {
            const t = cap.temas.find(tema => tema.id === idTema);
            if (t) temaEncontrado = t;
        });
    }

    if (temaEncontrado) {
        renderizarContenidoTema(temaEncontrado);
    }
}

/**
 * Renderiza los bloques de contenido de un tema y les añade utilidades avanzadas (Copiar).
 */
function renderizarContenidoTema(tema) {
    console.log(`App: Dibujando bloques del tema actual en pantalla ("${tema.titulo}")`);
    DOM.themeTitle.textContent = tema.titulo;
    DOM.themeBody.innerHTML = ''; 

    tema.contenido.forEach((bloque, indice) => {
        let elemento;

        console.log(`App: Procesando bloque índice [${indice}] de tipo [${bloque.tipo}]`);

        switch (bloque.tipo) {
            case 'parrafo':
                elemento = document.createElement('p');
                elemento.className = 'block-parrafo';
                elemento.textContent = bloque.texto;
                elemento.style.whiteSpace = 'pre-line'; // Garantiza soporte nativo de saltos de línea (\n)
                break;

            case 'codigo':
                elemento = document.createElement('pre');
                elemento.className = 'block-codigo';
                elemento.style.position = 'relative'; // Base para la correcta alineación del botón flotante
                
                const codigoInterno = document.createElement('code');
                codigoInterno.textContent = bloque.codigo;
                elemento.appendChild(codigoInterno);
                
                // Botón flotante para copiar el bloque de código al portapapeles
                const btnCopiar = document.createElement('button');
                btnCopiar.textContent = '📋 Copiar';
                btnCopiar.style.position = 'absolute';
                btnCopiar.style.top = '10px';
                btnCopiar.style.right = '10px';
                btnCopiar.style.padding = '4px 10px';
                btnCopiar.style.fontSize = '0.75rem';
                btnCopiar.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                btnCopiar.style.color = '#ffffff';
                btnCopiar.style.border = '1px solid rgba(255, 255, 255, 0.25)';
                btnCopiar.style.borderRadius = '4px';
                btnCopiar.style.cursor = 'pointer';
                btnCopiar.style.transition = 'all 0.2s ease';
                
                btnCopiar.addEventListener('mouseenter', () => btnCopiar.style.backgroundColor = 'rgba(255, 255, 255, 0.25)');
                btnCopiar.addEventListener('mouseleave', () => btnCopiar.style.backgroundColor = 'rgba(255, 255, 255, 0.12)');
                
                btnCopiar.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(bloque.codigo);
                        console.log("App: Bloque de código copiado con éxito.");
                        mostrarToast("¡Código copiado al portapapeles!", "success");
                        
                        btnCopiar.textContent = '✅ Copiado';
                        btnCopiar.style.borderColor = '#2e7d32';
                        setTimeout(() => {
                            btnCopiar.textContent = '📋 Copiar';
                            btnCopiar.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                        }, 2000);
                    } catch (err) {
                        console.error("App: Fallo al utilizar API portapapeles: ", err);
                        mostrarToast("Error al copiar el código", "error");
                    }
                });
                
                elemento.appendChild(btnCopiar);
                break;

            case 'nota':
                elemento = document.createElement('div');
                elemento.className = 'block-nota';
                // SOLUCIÓN: Eliminada la línea corrupta con el símbolo '$' que provocaba el crash del bucle
                elemento.textContent = bloque.texto;
                break;
        }

        if (elemento) {
            DOM.themeBody.appendChild(elemento);
        } else {
            console.warn(`App: El bloque en el índice [${indice}] no generó un elemento HTML válido.`);
        }
    });
}

/**
 * Reemplazo elegante de alert() usando componentes de notificación flotantes (Toasts).
 * @param {string} mensaje - Texto informativo a mostrar.
 * @param {string} tipo - Categoría visual ('success' | 'error' | 'info').
 */
export function mostrarToast(mensaje, tipo = 'info') {
    console.log(`ToastService: Desplegando notificación [${tipo}]: "${mensaje}"`);
    
    let contenedorToasts = document.getElementById('toast-container');
    if (!contenedorToasts) {
        contenedorToasts = document.createElement('div');
        contenedorToasts.id = 'toast-container';
        contenedorToasts.style.position = 'fixed';
        contenedorToasts.style.bottom = '24px';
        contenedorToasts.style.right = '24px';
        contenedorToasts.style.zIndex = '99999';
        contenedorToasts.style.display = 'flex';
        contenedorToasts.style.flexDirection = 'column';
        contenedorToasts.style.gap = '10px';
        document.body.appendChild(contenedorToasts);
    }

    const toast = document.createElement('div');
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '6px';
    toast.style.color = '#ffffff';
    toast.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    toast.style.fontSize = '0.9rem';
    toast.style.fontWeight = '500';
    toast.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.3)';
    toast.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    toast.style.transform = 'translateY(30px) scale(0.9)';
    toast.style.opacity = '0';
    toast.textContent = mensaje;

    if (tipo === 'success') toast.style.backgroundColor = '#10b981';
    else if (tipo === 'error') toast.style.backgroundColor = '#ef4444';
    else toast.style.backgroundColor = '#3b82f6';

    contenedorToasts.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0) scale(1)';
    }, 20);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px) scale(0.9)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Inicialización de la SPA
inicializarApp();