/**
 * components/sidebar.js
 * Componente encargado de renderizar la barra de navegación izquierda.
 */

export function renderSidebar() {
    console.log('[Component-Sidebar]: Renderizando barra lateral...');
    const container = document.getElementById('sidebar-container');
    
    if (!container) return;

    container.innerHTML = `
        <div class="sidebar-logo">
            <h2 style="color: #1ed760; font-size: 24px; font-weight: 800; letter-spacing: -1px;">
                <span style="color: white;">⚡</span> CloneFy
            </h2>
        </div>
        <ul class="sidebar-menu">
            <li class="active"><a href="#"><span class="icon">🏠</span> Inicio</a></li>
            <li><a href="#"><span class="icon">🔍</span> Buscar</a></li>
            <li><a href="#"><span class="icon">📚</span> Tu Biblioteca</a></li>
        </ul>
        <div class="sidebar-library">
            <ul class="sidebar-menu">
                <li><a href="#"><span class="icon">➕</span> Crear lista</a></li>
                <li><a href="#"><span class="icon">❤️</span> Canciones que te gustan</a></li>
            </ul>
        </div>
    `;
}