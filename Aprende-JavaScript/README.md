# 🚀 JS.Guide - Guía de Aprendizaje JavaScript

Esta es una SPA (Single Page Application) diseñada para el aprendizaje técnico, estructurada bajo un patrón de arquitectura de capas y un sistema de gestión modular.

## 🛠 Estado Actual del Proyecto

### Arquitectura Técnica
* **Patrón:** SPA (Single Page Application) con navegación dinámica mediante módulos.
* **Estilo:** Arquitectura de capas (Controlador -> Servicio -> Repositorio).
* **Diseño Visual:** Tema oscuro profesional con CSS modular.
* **Gestión de Estado:** `localStorage` para persistencia local y modo administrador.
* **Estructura de Ficheros:**
    * `index.html`: Punto de entrada único.
    * `/data/data.json`: Fuente de verdad (temario).
    * `/js/`: Módulos lógicos (`app.js`, `router.js`, `guia.js`, etc.).
    * `/css/`: Estilos centralizados en `main.css`.

### Temario Implementado
* **Fundamentos:** Entorno, variables, estructuras de control.
* **POO:** Clases, constructores y herencia.
* **Arquitectura Profesional:** Capas, Inyección de Dependencias y Clean Code.

---

## 🚧 Roadmap: Hoja de Ruta

### 1. Refactorización a Arquitectura Modular (Prioridad Alta)
* [ ] **Migración a ES6 Modules:** Implementar `type="module"` en el `index.html`.
* [ ] **Implementación del Router:** Finalizar `js/router.js` para la carga dinámica de vistas.
* [ ] **División de Responsabilidades:** Consolidar módulos (`guia.js`, `ejercicios.js`, `herramientas.js`).

### 2. Ampliación de Vistas
* [ ] **Sección de Ejercicios:** Crear módulo de renderizado de retos prácticos.
* [ ] **Sección de Herramientas:** Implementar tarjetas de recursos y enlaces de interés.

### 3. Optimización Visual
* [ ] **Resaltado de sintaxis:** Evaluar implementación de librería ligera (ej. Prism.js).

### 4. Modo Administrador
* [ ] **Persistencia:** Consolidar el flujo de guardado de formularios vía `storage.js`.

---

## 📝 Notas del Desarrollador
* **Patrón de arquitectura:** Mantener el flujo: Controlador (interacción) -> Servicio (lógica) -> Repositorio (datos).
* **Estilos:** Usar `components.css` para nuevos bloques para evitar duplicidad.
* **Debug:** Mantener `console.log` en los puntos críticos de los módulos durante la migración.