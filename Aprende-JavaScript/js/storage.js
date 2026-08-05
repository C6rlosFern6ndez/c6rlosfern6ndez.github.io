/**
 * Servicio encargado de la obtención de datos estáticos.
 * Se ha eliminado la persistencia en LocalStorage para simplificar la arquitectura.
 */
const JSON_URL = './data/data.json';
const TOOLS_URL = './data/tools.json';
const TRAINING_URL = './data/training.json';

/**
 * Obtiene los datos correspondientes consultando el archivo estático adecuado.
 * @param {string} paginaActual - Nombre de la página HTML actual (ej. 'ejercicios.html').
 * @returns {Promise<Object>} Estructura completa de los datos solicitados.
 */
export async function obtenerDatosGuia(paginaActual) {
    // Por defecto cargamos la guía principal si no coincide con ninguna otra
    let urlSeleccionada = JSON_URL;

    // Evaluamos la página actual para asignar la URL del JSON correspondiente
    if (paginaActual.includes('ejercicios.html')) {
        urlSeleccionada = TRAINING_URL;
    } else if (paginaActual.includes('herramientas.html')) {
        urlSeleccionada = TOOLS_URL;
    }

    console.log(`StorageService: Detectada la página "${paginaActual}". Cargando datos desde: ${urlSeleccionada}`);
    
    try {
        const respuesta = await fetch(urlSeleccionada);
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
        
        const datosBase = await respuesta.json();
        console.log(`StorageService: Datos de "${urlSeleccionada}" cargados con éxito.`);
        return datosBase;
    } catch (error) {
        console.error(`StorageService: Error crítico al cargar ${urlSeleccionada}:`, error);
        return null;
    }
}