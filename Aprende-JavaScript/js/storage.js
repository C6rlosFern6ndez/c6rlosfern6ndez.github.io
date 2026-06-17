/**
 * Servicio encargado de la gestión de persistencia de datos en el cliente.
 */

const STORAGE_KEY = 'js_guide_data';
const JSON_URL = './data/data.json';

/**
 * Obtiene los datos de la guía, priorizando LocalStorage o consultando el archivo estático.
 * @returns {Promise<Object>} Estructura completa de la guía de programación.
 */
export async function obtenerDatosGuia() {
    console.log("StorageService: Iniciando carga de datos...");
    
    // Intentar recuperar copia modificada del LocalStorage
    const datosLocales = localStorage.getItem(STORAGE_KEY);
    
    if (datosLocales) {
        console.log("StorageService: Datos recuperados con éxito desde LocalStorage.");
        return JSON.parse(datosLocales);
    }
    
    // Si no existe en LocalStorage, realizar petición HTTP al JSON estático
    console.log("StorageService: LocalStorage vacío. Realizando fetch a data.json...");
    try {
        const respuesta = await fetch(JSON_URL);
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
        
        const datosBase = await respuesta.json();
        
        // Inicializar LocalStorage con los datos base para futuras sesiones
        localStorage.setItem(STORAGE_KEY, JSON.stringify(datosBase));
        console.log("StorageService: Datos base cargados e inicializados en LocalStorage.");
        return datosBase;
    } catch (error) {
        console.error("StorageService: Error crítico al cargar data.json:", error);
        return null;
    }
}

/**
 * Guarda el estado actual de la guía en el LocalStorage del navegador.
 * @param {Object} nuevosDatos - Estructura de datos actualizada.
 */
export function guardarDatosLocales(nuevosDatos) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosDatos));
        console.log("StorageService: Cambios guardados en LocalStorage correctamente.");
    } catch (error) {
        console.error("StorageService: Error al guardar en LocalStorage:", error);
    }
}