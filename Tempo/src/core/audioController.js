/**
 * core/audioController.js
 * Clase encargada de gestionar de forma exclusiva la API nativa de Audio de HTML5.
 * Proporciona una interfaz limpia para reproducir, pausar y controlar el audio.
 */

class AudioController {
    constructor() {
        // Inicialización de la instancia nativa del reproductor de HTML5
        this.audio = new Audio();
        console.log('[AudioController]: Instancia nativa de HTML5 Audio inicializada.');
    }

    /**
     * Carga y reproduce una pista de audio a partir de su URL.
     * @param {string} url - Dirección de streaming del archivo de audio.
     */
    playTrack(url) {
        if (!url) {
            console.error('[AudioController]: No se puede reproducir, URL no válida.');
            return;
        }

        console.log(`[AudioController]: Intentando reproducir origen: ${url}`);
        
        // Si es una canción nueva, cambiamos la fuente de audio
        if (this.audio.src !== url) {
            this.audio.src = url;
        }

        this.audio.play()
            .then(() => console.log('[AudioController]: Reproducción iniciada con éxito.'))
            .catch(error => console.error('[AudioController]: Error al iniciar la reproducción:', error));
    }

    /**
     * Pausa la canción que está sonando actualmente.
     */
    pause() {
        console.log('[AudioController]: Audio pausado.');
        this.audio.pause();
    }

    /**
     * Modifica el volumen del reproductor.
     * @param {number} volume - Nivel de volumen entre 0.0 y 1.0
     */
    setVolume(volume) {
        if (volume < 0 || volume > 1) return;
        this.audio.volume = volume;
        console.log(`[AudioController]: Volumen actualizado a: ${volume * 100}%`);
    }

    /**
     * Modifica el punto de reproducción actual (adelantar/atrasar).
     * @param {number} seconds - Segundo exacto de la canción.
     */
    setCurrentTime(seconds) {
        if (isNaN(seconds)) return;
        this.audio.currentTime = seconds;
        console.log(`[AudioController]: Tiempo cambiado a: ${seconds}s`);
    }
}

// Exportamos una única instancia (Singleton) para asegurar que no haya múltiples reproductores sonando a la vez
export const audioController = new AudioController();