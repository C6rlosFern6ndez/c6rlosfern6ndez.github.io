/**
 * components/playerBar.js
 * Componente encargado de gestionar la barra inferior de reproducción,
 * sus actualizaciones de interfaz y sus eventos multimedia.
 */

import { playerState } from '../state/playerState.js';
import { audioController } from '../core/audioController.js';

export function renderPlayerBar() {
    console.log('[Component-PlayerBar]: Renderizando estructura inicial del reproductor...');
    const container = document.getElementById('player-bar-container');
    if (!container) return;

    container.innerHTML = `
        <div class="player-track-info" id="mini-track-info">
            <div class="player-track-img" style="background-color: #282828;"></div>
            <div class="player-track-details">
                <div class="player-track-title">Ninguna canción seleccionada</div>
                <div class="player-track-artist">-</div>
            </div>
        </div>

        <div class="player-controls">
            <div class="control-buttons">
                <button class="btn-control" id="btn-prev">⏮</button>
                <button class="btn-control btn-play-pause" id="btn-toggle-play">▶</button>
                <button class="btn-control" id="btn-next">⏭</button>
            </div>
            <div class="progress-container">
                <span id="time-current">0:00</span>
                <div class="progress-bar" id="ui-progress-bar">
                    <div class="progress-current" id="ui-progress-current"></div>
                </div>
                <span id="time-total">0:00</span>
            </div>
        </div>

        <div class="player-volume">
            <span>🔊</span>
            <input type="range" class="volume-slider" id="ui-volume-slider" min="0" max="1" step="0.01" value="0.5">
        </div>
    `;

    // Inicializamos los eventos de control de la barra inferior
    initPlayerBarEvents();
}

/**
 * Vincula las interacciones de los botones y barras deslizantes con el estado global.
 */
function initPlayerBarEvents() {
    console.log('[Component-PlayerBar]: Vinculando eventos multimedia del reproductor.');

    const togglePlayBtn = document.getElementById('btn-toggle-play');
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const volumeSlider = document.getElementById('ui-volume-slider');
    const progressBar = document.getElementById('ui-progress-bar');

    // Evento de Play / Pausa central
    togglePlayBtn.addEventListener('click', () => {
        console.log('[Component-PlayerBar-Event]: Click en Play/Pausa.');
        playerState.togglePlay();
    });

    // Evento canción anterior
    prevBtn.addEventListener('click', () => {
        console.log('[Component-PlayerBar-Event]: Click en Anterior ⏮.');
        playerState.previousTrack();
    });

    // Evento canción siguiente
    nextBtn.addEventListener('click', () => {
        console.log('[Component-PlayerBar-Event]: Click en Siguiente ⏭.');
        playerState.nextTrack();
    });

    // Evento de cambio de volumen continuo (input)
    volumeSlider.addEventListener('input', (event) => {
        const volumeValue = parseFloat(event.target.value);
        playerState.changeVolume(volumeValue);
    });

    // Evento para adelantar o retrasar la canción al hacer click en la barra de progreso
    progressBar.addEventListener('click', (event) => {
        const audio = audioController.audio;
        if (!audio.duration) return;

        // Calculamos la posición del click relativa al ancho total de la barra
        const rect = progressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;

        // Calculamos el segundo exacto correspondiente y actualizamos el motor de audio
        const targetSeconds = percentage * audio.duration;
        audioController.setCurrentTime(targetSeconds);
    });

    // ==========================================================================
    // ESCUCHA DE EVENTOS NATIVOS DEL MOTOR DE AUDIO (Tiempo y Progreso)
    // ==========================================================================
    
    // El objeto Audio nativo nos avisa constantemente cuando avanza la aguja del tiempo
    audioController.audio.addEventListener('timeupdate', () => {
        const audio = audioController.audio;
        if (!audio.duration) return;

        const currentTime = audio.currentTime;
        const duration = audio.duration;

        // 1. Calcular porcentaje para mover visualmente la barra blanca
        const progressPercentage = (currentTime / duration) * 100;
        document.getElementById('ui-progress-current').style.width = `${progressPercentage}%`;

        // 2. Actualizar los textos de minutos y segundos en pantalla
        document.getElementById('time-current').textContent = formatTime(currentTime);
        document.getElementById('time-total').textContent = formatTime(duration);
    });

    // Cuando una canción termine por completo, salta automáticamente a la siguiente
    audioController.audio.addEventListener('ended', () => {
        console.log('[AudioEngine-Event]: Canción terminada. Saltando automáticamente...');
        playerState.nextTrack();
    });
}

/**
 * Utilidad profesional para dar formato MM:SS a los segundos de reproducción.
 */
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function updatePlayerBarUI(state) {
    const trackInfo = document.getElementById('mini-track-info');
    const togglePlayBtn = document.getElementById('btn-toggle-play');

    if (!trackInfo || !togglePlayBtn) return;

    if (state.currentTrack) {
        trackInfo.innerHTML = `
            <img src="${state.currentTrack.cover}" alt="${state.currentTrack.title}" class="player-track-img">
            <div class="player-track-details">
                <div class="player-track-title">${state.currentTrack.title}</div>
                <div class="player-track-artist">${state.currentTrack.artist}</div>
            </div>
        `;
    }

    togglePlayBtn.textContent = state.isPlaying ? '⏸' : '▶';
}