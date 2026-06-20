/**
 * api/musicApi.js
 * Servicio encargado de conectarse con la API REST externa de Jamendo.
 * Realiza peticiones HTTP asíncronas para obtener canciones reales en streaming.
 */

class MusicApi {
    constructor() {
        // ID de cliente gratuito de pruebas oficial de Jamendo
        this.clientId = '56d30c55';
        // Base URL del endpoint de canciones
        this.baseUrl = 'https://api.jamendo.com/v3.0/tracks/';
    }

    /**
     * Realiza una petición GET a la API REST de Jamendo para recuperar canciones.
     * @returns {Promise<Array>} Promesa que resuelve con el formato unificado de canciones.
     */
    async getTracks() {
        // Cambiamos 'popularity_month' por 'popularity_total' para asegurar que el servidor siempre devuelva datos activos
        const url = `${this.baseUrl}?client_id=${this.clientId}&format=jsonbeauty&limit=20&order=popularity_total&include=musicinfo`;
        
        console.log(`[MusicApi]: Realizando petición HTTP FETCH a: ${url}`);

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error en la petición HTTP: Status ${response.status}`);
            }

            const data = await response.json();
            console.log('[MusicApi]: Respuesta JSON recibida desde Jamendo:', data);

            // Control de seguridad: Si la API responde pero el array viene vacío, usamos un plan de contingencia
            if (!data.results || data.results.length === 0) {
                console.warn('[MusicApi]: La API devolvió un array vacío. Cargando catálogo alternativo de respaldo.');
                return this._getFallbackTracks();
            }

            // Modelamos y mapeamos la estructura de la API externa
            return data.results.map(track => {
                return {
                    id: track.id.toString(),
                    title: track.name,
                    artist: track.artist_name,
                    album: track.album_name || 'Single',
                    cover: track.album_image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
                    url: track.audio
                };
            });

        } catch (error) {
            console.error('[MusicApi]: Error crítico al consumir la API REST externa. Cargando respaldo.', error);
            return this._getFallbackTracks();
        }
    }

    /**
     * Método privado de respaldo (Fallback) para que la aplicación nunca se quede en blanco 
     * si el servidor externo de Jamendo se cae por completo.
     */
    _getFallbackTracks() {
        return [
            {
                id: 'f1',
                title: 'Acoustic Breeze',
                artist: 'Benjamin Tissot',
                album: 'Bensound Originals',
                cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
                url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
            },
            {
                id: 'f2',
                title: 'Cyberpunk Drive',
                artist: 'SynthWave Labs',
                album: 'Neon City',
                cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400',
                url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
            }
        ];
    }
}

export const musicApi = new MusicApi();