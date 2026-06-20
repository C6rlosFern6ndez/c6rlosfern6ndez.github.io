/**
 * components/mainContent.js
 * Componente encargado de gestionar las diferentes pantallas (Home y Buscar)
 * e inyectar el HTML correspondiente de forma dinámica junto a su lógica.
 */

import { playerState } from '../state/playerState.js';

/**
 * Renderiza la pantalla de Inicio (Home) con la rejilla de canciones completa.
 * @param {Array} tracks - Lista de canciones de la API.
 */
export function renderMainContent(tracks) {
    console.log('[Component-MainContent]: Renderizando pantalla de Inicio...');
    let container = document.getElementById('main-content-container');
    if (!container) return;

    // Limpiamos eventos antiguos duplicando el nodo antes de inyectar el nuevo HTML
    const cleanContainer = container.cloneNode(false);
    container.parentNode.replaceChild(cleanContainer, container);
    container = cleanContainer;

    const cardsHTML = tracks.map(track => `
        <div class="music-card" data-id="${track.id}">
            <div class="card-img-container">
                <img src="${track.cover}" alt="${track.title}" class="card-img" loading="lazy">
                <button class="card-play-btn" data-id="${track.id}">▶</button>
            </div>
            <div class="card-title">${track.title}</div>
            <div class="card-description">${track.artist} • ${track.album}</div>
        </div>
    `).join('');

    container.innerHTML = `
        <h1>Buenas tardes</h1>
        <div class="cards-grid">
            ${cardsHTML}
        </div>
    `;

    // Inicializamos eventos de reproducción sobre el contenedor limpio
    initMainContentEvents(container, tracks);
}

/**
 * Renderiza la pantalla de Búsqueda (Search) y gestiona el filtrado reactivo.
 * @param {Array} tracks - Lista completa de canciones para poder filtrar.
 */
export function renderSearchContent(tracks) {
    console.log('[Component-MainContent]: Renderizando pantalla de Búsqueda...');
    let container = document.getElementById('main-content-container');
    if (!container) return;

    // 1. Limpiamos por completo el contenedor (y sus eventos previos) clonándolo vacío
    const cleanContainer = container.cloneNode(false);
    container.parentNode.replaceChild(cleanContainer, container);
    container = cleanContainer;

    // 2. Inyectamos la estructura base de la sección de búsqueda
    container.innerHTML = `
        <h1>Buscar</h1>
        <div style="margin-bottom: 24px;">
            <input type="text" id="search-input" placeholder="¿Qué quieres escuchar?" 
                   style="width: 100%; max-width: 400px; padding: 12px 24px; border-radius: 50px; border: none; background-color: #242424; color: white; font-size: 14px; outline: none;">
        </div>
        <div class="cards-grid" id="search-results-grid">
            </div>
    `;

    // 3. Ahora que el HTML real está en el DOM, capturamos los elementos reactivos
    const searchInput = document.getElementById('search-input');
    const resultsGrid = document.getElementById('search-results-grid');

    /**
     * Función interna para filtrar y actualizar los resultados en pantalla
     * @param {string} query - Texto introducido por el usuario
     */
    const updateResults = (query) => {
        console.log(`[Component-MainContent-Search]: Filtrando por la consulta: "${query}"`);
        
        const filteredTracks = tracks.filter(track => 
            track.title.toLowerCase().includes(query.toLowerCase()) || 
            track.artist.toLowerCase().includes(query.toLowerCase())
        );

        console.log(`[Component-MainContent-Search]: Coincidencias encontradas: ${filteredTracks.length}`);

        if (filteredTracks.length === 0) {
            resultsGrid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1;">No se encontraron resultados para "${query}"</p>`;
            return;
        }

        resultsGrid.innerHTML = filteredTracks.map(track => `
            <div class="music-card" data-id="${track.id}">
                <div class="card-img-container">
                    <img src="${track.cover}" alt="${track.title}" class="card-img" loading="lazy">
                    <button class="card-play-btn" data-id="${track.id}">▶</button>
                </div>
                <div class="card-title">${track.title}</div>
                <div class="card-description">${track.artist} • ${track.album}</div>
            </div>
        `).join('');
    };

    // Renderizado inicial automático al entrar a la sección (muestra todo)
    updateResults('');

    // 4. Asignamos el escuchador al input (ahora sí persistirá porque no se vuelve a clonar el padre)
    searchInput.addEventListener('input', (e) => {
        console.log(`[Component-MainContent-Search-Event]: Detectada pulsación: ${e.target.value}`);
        updateResults(e.target.value);
    });

    // 5. Vinculamos la escucha de clicks de reproducción mediante delegación
    initMainContentEvents(container, tracks);
}

/**
 * Inicializa los eventos de click delegados para reproducir música de forma limpia.
 * @param {HTMLElement} targetContainer - Contenedor sobre el que se aplica la escucha.
 * @param {Array} tracks - La lista completa de canciones del sistema.
 */
function initMainContentEvents(targetContainer, tracks) {
    console.log('[Component-MainContent]: Configurando delegación de eventos para reproducción.');

    targetContainer.addEventListener('click', (event) => {
        const playBtn = event.target.closest('.card-play-btn');
        const card = event.target.closest('.music-card');

        if (playBtn || card) {
            const trackId = playBtn ? playBtn.dataset.id : card.dataset.id;
            console.log(`[Component-MainContent-Event]: Click de reproducción en canción con ID: ${trackId}`);

            const trackIndex = tracks.findIndex(t => t.id === trackId);

            if (trackIndex !== -1) {
                playerState.setPlaylist(tracks, trackIndex);
            } else {
                console.error('[Component-MainContent-Event]: No se localizó el índice de la canción elegida.');
            }
        }
    });
}