/**
 * state/playerState.js
 * Objeto encargado de almacenar el estado global del reproductor y 
 * notificar a los suscriptores cuando ocurre un cambio.
 */

class PlayerState {
    constructor() {
        // PASO 5.2: Recuperar volumen previo de LocalStorage, o usar 0.5 por defecto
        const savedVolume = localStorage.getItem('clonefy_volume');
        
        this.state = {
            currentTrack: null,
            isPlaying: false,
            volume: savedVolume !== null ? parseFloat(savedVolume) : 0.5,
            playlist: [],
            currentIndex: -1
        };

        this.listeners = [];
        console.log(`[PlayerState]: Estado inicial cargado. Volumen recuperado: ${this.state.volume * 100}%`);
    }

    /**
     * Devuelve una copia de lectura del estado actual.
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Permite a componentes o controladores suscribirse a los cambios de estado.
     * @param {Function} callback - Función que se ejecutará cada vez que el estado mute.
     */
    subscribe(callback) {
        this.listeners.push(callback);
        console.log(`[PlayerState]: Nuevo suscriptor registrado. Total: ${this.listeners.length}`);
    }

    /**
     * Notifica a todos los elementos suscritos enviándoles el nuevo estado.
     */
    _notify() {
        console.log('[PlayerState]: El estado ha cambiado. Notificando a suscriptores...', this.state);
        this.listeners.forEach(callback => callback(this.state));
    }

    /**
     * Establece la lista de reproducción y activa la primera canción o una elegida.
     * @param {Array} tracks - Array de objetos de canciones.
     * @param {number} index - Índice de la canción que debe empezar a sonar.
     */
    setPlaylist(tracks, index = 0) {
        this.state.playlist = tracks;
        this.state.currentIndex = index;
        this.state.currentTrack = tracks[index];
        this.state.isPlaying = true;
        this._notify();
    }

    /**
     * Alterna entre reproducción y pausa.
     */
    togglePlay() {
        if (!this.state.currentTrack) return;
        this.state.isPlaying = !this.state.isPlaying;
        this._notify();
    }

    /**
     * Actualiza el nivel de volumen global y lo persiste en LocalStorage.
     * @param {number} value - Volumen entre 0 y 1.
     */
    changeVolume(value) {
        this.state.volume = value;
        // Guardamos de forma inmediata en el navegador del usuario
        localStorage.setItem('clonefy_volume', value);
        this._notify();
    }

    /**
     * Salta a la siguiente canción de la lista si existe.
     */
    nextTrack() {
        if (this.state.playlist.length === 0) return;
        
        let nextIndex = this.state.currentIndex + 1;
        if (nextIndex >= this.state.playlist.length) {
            nextIndex = 0; // Bucle: vuelve al inicio de la playlist
        }

        this.state.currentIndex = nextIndex;
        this.state.currentTrack = this.state.playlist[nextIndex];
        this.state.isPlaying = true;
        this._notify();
    }

    /**
     * Retrocede a la canción anterior.
     */
    previousTrack() {
        if (this.state.playlist.length === 0) return;

        let prevIndex = this.state.currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = this.state.playlist.length - 1; // Vuelve al final si está al principio
        }

        this.state.currentIndex = prevIndex;
        this.state.currentTrack = this.state.playlist[prevIndex];
        this.state.isPlaying = true;
        this._notify();
    }
}

export const playerState = new PlayerState();