# 🎵 Spotify Clone — Vanilla JavaScript SPA

¡Bienvenido a mi clon de Spotify! Este proyecto es una aplicación web Frontend (Single Page Application) construida exclusivamente con **JavaScript Vanilla (puro)**, HTML5 y CSS3. El objetivo principal es demostrar el dominio de la manipulación avanzada del DOM, la gestión de estados globales sin frameworks, programación asíncrona y el uso de las APIs nativas del navegador.

---

## 🚀 Características Principales (Features)
*   **Single Page Application (SPA):** Navegación fluida entre secciones (Home, Buscar, Biblioteca) sin recargar la página.
*   **Reproductor de Audio Avanzado:** Control total de reproducción (Play/Pausa, Siguiente/Anterior, barra de progreso interactiva y control de volumen) usando la **HTML5 Audio API**.
*   **Arquitectura Modular:** Código desacoplado utilizando **Módulos ES6 (`import`/`export`)** para facilitar la escalabilidad.
*   **Diseño Responsive y Fiel:** Interfaz de usuario pixel-perfect inspirada en la aplicación oficial de Spotify, construida con CSS Grid y Flexbox.
*   **Gestión de Estado Centralizada:** Sistema propio para controlar el estado global del reproductor y sincronizar la interfaz en tiempo real.

---

## 🛠️ Tecnologías y Herramientas
*   **Lenguaje:** JavaScript (ES6+), HTML5, CSS3.
*   **Estilos:** Variables CSS, CSS Grid, Flexbox y animaciones nativas.
*   **Audio Engine:** HTML5 Audio API (`new Audio()`).
*   **Persistencia:** `LocalStorage` para guardar el volumen y las últimas canciones escuchadas.

---

## 🗺️ Roadmap de Desarrollo (Pasos a Seguir)

Para construir esta aplicación de manera ordenada y profesional, seguiremos este plan de desarrollo dividido en fases:

### 🔹 Fase 1: Arquitectura y Maquetación Base (UI)
- [x] **Paso 1.1:** Configurar la estructura de carpetas y archivos del proyecto.
- [x] **Paso 1.2:** Crear el layout general en `index.html` y configurar el sistema de rejillas (CSS Grid) en `main.css`.
- [x] **Paso 1.3:** Maquetar la barra lateral (`sidebar.css`) y la barra del reproductor inferior (`player.css`) con estilos estáticos (mockups).
- [x] **Paso 1.4:** Diseñar los componentes de las tarjetas de canciones (`cards.css`) y la cuadrícula del contenido principal.

### 🔹 Fase 2: El Motor de Audio y Estado Global (Core)
- [x] **Paso 2.1:** Crear el controlador de audio (`audioController.js`) encapsulando el objeto nativo `new Audio()`.
- [x] **Paso 2.2:** Implementar el gestor de estado (`playerState.js`) para manejar de forma centralizada qué canción suena, si está en pausa, la lista actual y el volumen.
- [x] **Paso 2.3:** Conectar el estado con el controlador de audio para que reaccione a los cambios de manera automática.

### 🔹 Fase 3: Modularización de Componentes y Renderizado Dinámico
- [x] **Paso 3.1:** Crear el servicio de datos (`musicApi.js`) para simular o consumir las canciones (mediante un archivo JSON local inicial).
- [x] **Paso 3.2:** Programar `mainContent.js` para inyectar dinámicamente las tarjetas de música en el DOM según los datos obtenidos.
- [x] **Paso 3.3:** Programar `playerBar.js` para que actualice la carátula, el título, el progreso del tiempo y los botones (Play/Pausa) según el estado global.

### 🔹 Fase 4: Interactividad y Eventos (Lógica de Usuario)
- [ ] **Paso 4.1:** Escuchar los clicks en las tarjetas de música para activar la canción seleccionada en el reproductor.
- [ ] **Paso 4.2:** Implementar la lógica de los botones de la barra inferior (Play, Pausa, Siguiente, Anterior).
- [ ] **Paso 4.3:** Hacer funcionales la barra de progreso (poder saltar a un segundo exacto de la canción) y el control deslizante de volumen.

### 🔹 Fase 5: Enrutamiento (SPA) y Pulido Final
- [ ] **Paso 5.1:** Crear un sistema de navegación básico en el Frontend para cambiar entre la vista "Home" y la vista "Buscar" sin recargar el navegador.
- [ ] **Paso 5.2:** Añadir persistencia de datos con `LocalStorage` (ej. recordar el último volumen configurado por el usuario).
- [ ] **Paso 5.3:** Revisión de rendimiento (evitar re-renderizados innecesarios del DOM) y limpieza de comentarios profesionales en el código.

---

## ✒️ Autor
* **Tu Nombre** - *Estudiante de Programación / Desarrollador Frontend* - [Tu GitHub](https://github.com/tu-usuario)