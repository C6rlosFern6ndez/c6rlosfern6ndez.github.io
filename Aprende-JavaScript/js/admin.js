/**
 * Módulo Administrador: Gestiona el estado de edición, generación de formularios reactivos,
 * alta de contenidos y exportación, integrado con el sistema de Toasts.
 */

import { guardarDatosLocales } from './storage.js';
import { mostrarToast } from './app.js'; // Importamos la nueva utilidad visual

const DOM = {
    btnToggleAdmin: document.getElementById('btn-toggle-admin'),
    btnExportJson: document.getElementById('btn-export-json'),
    viewerMode: document.getElementById('viewer-mode'),
    adminMode: document.getElementById('admin-mode'),
    adminForm: document.getElementById('admin-form'),
    adminFormFields: document.getElementById('admin-form-fields'),
    adminThemeTitle: document.getElementById('admin-theme-title')
};

let modoAdminActivo = false;
let callbackRefrescarVisorGlobal = null;
let callbackRefrescarMenuGlobal = null;

export function configurarAdministrador(contextoApp, callbackRefrescarVisor, callbackRefrescarMenu) {
    console.log("AdminModule: Inicializando panel de administración avanzado...");
    
    callbackRefrescarVisorGlobal = callbackRefrescarVisor;
    callbackRefrescarMenuGlobal = callbackRefrescarMenu;

    inyectarControlesBloques(contextoApp);
    inyectarSeccionNuevoTema(contextoApp);

    DOM.btnToggleAdmin.addEventListener('click', () => {
        alternarModoAdmin(contextoApp);
    });

    DOM.adminForm.addEventListener('submit', (e) => {
        e.preventDefault();
        guardarCambiosFormulario(contextoApp);
    });

    DOM.btnExportJson.addEventListener('click', () => {
        exportarEstructuraJson(contextoApp.estadoGuia);
    });
}

export function alternarModoAdmin(contextoApp) {
    if (!contextoApp.temaSeleccionadoId && !modoAdminActivo) {
        mostrarToast("Por favor, selecciona primero un tema de la guía para editarlo.", "error");
        return;
    }

    modoAdminActivo = !modoAdminActivo;
    console.log(`AdminModule: Modo Administrador cambiado a: ${modoAdminActivo}`);

    DOM.viewerMode.classList.toggle('d-none', modoAdminActivo);
    DOM.adminMode.classList.toggle('d-none', !modoAdminActivo);
    DOM.btnExportJson.classList.toggle('d-none', !modoAdminActivo);
    
    DOM.btnToggleAdmin.textContent = modoAdminActivo ? "Modo Lectura" : "Modo Admin";
    DOM.btnToggleAdmin.classList.toggle('btn-primary', modoAdminActivo);
    DOM.btnToggleAdmin.classList.toggle('btn-secondary', !modoAdminActivo);

    if (modoAdminActivo) {
        poblarSelectCapitulos(contextoApp.estadoGuia);
        const temaActual = buscarTemaPorId(contextoApp.estadoGuia, contextoApp.temaSeleccionadoId);
        if (temaActual) generarFormularioEdicion(temaActual);
    }
}

function sincronizarValoresEnMemoria(tema) {
    if (!tema) return;
    const camposTexto = DOM.adminFormFields.querySelectorAll('textarea');
    
    camposTexto.forEach(textarea => {
        const indice = parseInt(textarea.dataset.index, 10);
        const bloque = tema.contenido[indice];
        if (bloque) {
            if (bloque.tipo === 'codigo') {
                bloque.codigo = textarea.value;
            } else {
                bloque.texto = textarea.value;
            }
        }
    });
}

function generarFormularioEdicion(tema) {
    DOM.adminThemeTitle.textContent = tema.titulo;
    DOM.adminFormFields.innerHTML = ''; 

    tema.contenido.forEach((bloque, indice) => {
        const grupoForm = document.createElement('div');
        grupoForm.className = 'form-group';

        const etiqueta = document.createElement('label');
        etiqueta.textContent = `Bloque ${indice + 1} - [${bloque.tipo.toUpperCase()}]`;
        grupoForm.appendChild(etiqueta);

        const areaTexto = document.createElement('textarea');
        areaTexto.dataset.index = indice; 

        if (bloque.tipo === 'codigo') {
            areaTexto.className = 'input-codigo';
            areaTexto.value = bloque.codigo;
        } else {
            areaTexto.value = bloque.texto;
        }
        grupoForm.appendChild(areaTexto);

        const btnEliminarBloque = document.createElement('button');
        btnEliminarBloque.type = 'button';
        btnEliminarBloque.className = 'btn';
        btnEliminarBloque.textContent = '🗑️ Eliminar Bloque';
        btnEliminarBloque.style.backgroundColor = '#ef4444';
        btnEliminarBloque.style.color = '#ffffff';
        btnEliminarBloque.style.marginTop = '0.5rem';
        
        btnEliminarBloque.addEventListener('click', () => {
            sincronizarValoresEnMemoria(tema);
            tema.contenido.splice(indice, 1);
            mostrarToast("Bloque eliminado del formulario", "info");
            generarFormularioEdicion(tema);
        });

        grupoForm.appendChild(btnEliminarBloque);
        DOM.adminFormFields.appendChild(grupoForm);
    });
}

function inyectarControlesBloques(contextoApp) {
    const contenedorControles = document.createElement('div');
    contenedorControles.className = 'form-group';
    contenedorControles.style.border = '1px dashed var(--color-border)';
    contenedorControles.style.padding = '1rem';
    contenedorControles.style.borderRadius = '4px';
    
    contenedorControles.innerHTML = `
        <label>✨ Añadir Elemento al Tema Actual</label>
        <div style="display: flex; gap: 10px; margin-top: 0.5rem;">
            <select id="select-tipo-bloque" style="flex: 1; padding: 0.5rem; border-radius: 4px; border: 1px solid var(--color-border); font-size: 1rem;">
                <option value="parrafo">📄 Párrafo de Texto</option>
                <option value="codigo">💻 Bloque de Código</option>
                <option value="nota">💡 Nota Informativa</option>
            </select>
            <button type="button" id="btn-add-block" class="btn btn-secondary" style="margin: 0;">➕ Insertar Bloque</button>
        </div>
    `;

    const accionesFormulario = DOM.adminForm.querySelector('.form-actions');
    DOM.adminForm.insertBefore(contenedorControles, accionesFormulario);

    // Manejador del evento de inserción inmediata de bloques con Toast de confirmación
    document.getElementById('btn-add-block').addEventListener('click', () => {
        const temaActual = buscarTemaPorId(contextoApp.estadoGuia, contextoApp.temaSeleccionadoId);
        if (!temaActual) return;

        sincronizarValoresEnMemoria(temaActual);

        const tipo = document.getElementById('select-tipo-bloque').value;
        const nuevoBloque = tipo === 'codigo' 
            ? { tipo: tipo, codigo: '// Escribe tu nuevo bloque de código aquí' } 
            : { tipo: tipo, texto: 'Escribe tu nuevo texto aquí...' };

        temaActual.contenido.push(nuevoBloque);
        mostrarToast(`Añadido nuevo bloque de tipo: ${tipo.toUpperCase()}`, "success");
        generarFormularioEdicion(temaActual);
    });
}

function inyectarSeccionNuevoTema(contextoApp) {
    const seccionNuevoTema = document.createElement('div');
    seccionNuevoTema.style.marginTop = '4rem';
    seccionNuevoTema.style.paddingTop = '2rem';
    seccionNuevoTema.style.borderTop = '3px double var(--color-border)';
    
    seccionNuevoTema.innerHTML = `
        <h3 style="margin-bottom: 1.5rem; color: var(--color-dark);">🆕 Estructura: Crear Nuevo Tema</h3>
        <div class="form-group">
            <label>Seleccionar Capítulo Destino</label>
            <select id="select-capitulo-destino" style="width: 100%; padding: 0.75rem; border-radius: 4px; border: 1px solid var(--color-border); font-size: 1rem;"></select>
        </div>
        <div class="form-group">
            <label>Título del Nuevo Tema</label>
            <input type="text" id="input-titulo-tema" placeholder="Ej. Promesas y Callbacks" style="width: 100%; padding: 0.75rem; border-radius: 4px; border: 1px solid var(--color-border); font-size: 1rem;">
        </div>
        <button type="button" id="btn-crear-tema" class="btn btn-success" style="margin-left: 0;">🚀 Registrar e Ir al Tema</button>
    `;

    DOM.adminMode.appendChild(seccionNuevoTema);

    document.getElementById('btn-crear-tema').addEventListener('click', () => {
        const selectCap = document.getElementById('select-capitulo-destino');
        const inputTitulo = document.getElementById('input-titulo-tema');
        const titulo = inputTitulo.value.trim();

        if (!titulo) {
            mostrarToast("Por favor, escribe un título válido para el nuevo tema.", "error");
            return;
        }

        const [claveNivel, tituloCapitulo] = selectCap.value.split('|');
        const nivel = contextoApp.estadoGuia.niveles[claveNivel];
        const capitulo = nivel.capitulos.find(c => c.titulo === tituloCapitulo);

        if (capitulo) {
            const nuevoId = `tema_${Date.now()}`; 
            const nuevoTema = {
                id: nuevoId,
                titulo: titulo,
                contenido: [{ tipo: 'parrafo', texto: 'Nuevo bloque inicial de texto. Modifícame.' }]
            };

            capitulo.temas.push(nuevoTema);
            guardarDatosLocales(contextoApp.estadoGuia);
            inputTitulo.value = '';

            if (callbackRefrescarMenuGlobal) callbackRefrescarMenuGlobal();
            
            contextoApp.temaSeleccionadoId = nuevoId;
            generarFormularioEdicion(nuevoTema);
            mostrarToast(`¡Tema "${titulo}" creado de forma exitosa!`, "success");
        }
    });
}

function poblarSelectCapitulos(estadoGuia) {
    const select = document.getElementById('select-capitulo-destino');
    if (!select) return;
    select.innerHTML = '';

    for (const claveNivel in estadoGuia.niveles) {
        const nivel = estadoGuia.niveles[claveNivel];
        nivel.capitulos.forEach(capitulo => {
            const opcion = document.createElement('option');
            opcion.value = `${claveNivel}|${capitulo.titulo}`;
            opcion.textContent = `[${nivel.nombre}] → ${capitulo.titulo}`;
            select.appendChild(opcion);
        });
    }
}

function guardarCambiosFormulario(contextoApp) {
    const temaActual = buscarTemaPorId(contextoApp.estadoGuia, contextoApp.temaSeleccionadoId);
    sincronizarValoresEnMemoria(temaActual);

    guardarDatosLocales(contextoApp.estadoGuia);
    alternarModoAdmin(contextoApp);
    
    if (callbackRefrescarVisorGlobal) callbackRefrescarVisorGlobal(temaActual);
    mostrarToast("¡Cambios almacenados correctamente!", "success");
}

function exportarEstructuraJson(datos) {
    console.log("AdminModule: Compilando data.json para volcado físico...");
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    mostrarToast("Estructura JSON descargada", "info");
}

function buscarTemaPorId(estado, idTema) {
    let temaEncontrado = null;
    for (const clave in estado.niveles) {
        estado.niveles[clave].capitulos.forEach(cap => {
            const t = cap.temas.find(tema => tema.id === idTema);
            if (t) temaEncontrado = t;
        });
    }
    return temaEncontrado;
}