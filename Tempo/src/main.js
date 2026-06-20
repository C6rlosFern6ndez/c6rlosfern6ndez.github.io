/**
 * main.js
 * Punto de entrada central de la aplicación.
 * Orquesta el flujo de inicialización, enrutamiento SPA y reactividad global.
 */

import { musicApi } from './api/musicApi.js';
import { playerState } from './state/playerState.js';
import { renderSidebar } from './components/sidebar.js';
import { renderMainContent, renderSearchContent } from './components/mainContent.js';
import { renderPlayerBar, updatePlayerBarUI } from './components/playerBar.js';
import { audioController } from './core/audioController.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('[Main]: Arrancando inicialización de vistas...');

    // 1. Renderizar estructuras fijas de la interfaz
    renderSidebar();
    renderPlayerBar();

    // 2. Sincronizar UI del Slider de Volumen con el estado inicial recuperado de LocalStorage
    const volumeSlider = document.getElementById('ui-volume-slider');
    if (volumeSlider) {
        volumeSlider.value = playerState.getState().volume;
    }

    // 3. Suscribir el núcleo del sistema al Estado Global (Patrón Observador)
    playerState.subscribe((state) => {
        audioController.setVolume(state.volume);
        updatePlayerBarUI(state);

        if (state.currentTrack) {
            if (state.isPlaying) {
                audioController.playTrack(state.currentTrack.url);
            } else {
                audioController.pause();
            }
        }
    });

    // 4. Carga de datos asíncronos y sistema de Enrutamiento SPA
    try {
        const tracks = await musicApi.getTracks();
        
        // Vista por defecto inicial: Home
        renderMainContent(tracks);

        // Capturamos los botones del menú de la barra lateral para el enrutador SPA
        const sidebar = document.getElementById('sidebar-container');
        
        sidebar.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            e.preventDefault(); // Evitamos que el enlace recargue la página

            // Quitamos la clase activa de todos los botones y se la damos al pulsado
            sidebar.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
            link.parentElement.classList.add('active');

            const text = link.textContent.trim();
            console.log(`[Main-Router]: Navegando hacia la pantalla: ${text}`);

            // Cambiamos el contenido central de forma dinámica según la opción
            if (text.includes('Inicio')) {
                renderMainContent(tracks);
            } else if (text.includes('Buscar')) {
                renderSearchContent(tracks);
            }
        });

        console.log('[Main]: ¡Fase 5 Completada! Aplicación lista para producción.');
    } catch (error) {
        console.error('[Main]: Error crítico durante la inicialización:', error);
    }
});