/**
 * SERVICIO: Capa encargada exclusivamente de la comunicación con la API de OpenWeatherMap
 * y del procesamiento/filtrado de datos crudos.
 */
class WeatherService {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Obtiene los datos del clima actual desde el endpoint /weather.
     */
    async fetchCurrentWeather(lat, lon, city) {
        let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lang=es&appid=${this.apiKey}`;
        url += city ? `&q=${encodeURIComponent(city)}` : `&lat=${lat}&lon=${lon}`;
        
        console.log(`WeatherService: Solicitando clima actual a: ${url}`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error Clima Actual: ${response.status}`);
        return await response.json();
    }

    /**
     * Obtiene el pronóstico extendido desde el endpoint /forecast.
     */
    async fetchForecast(lat, lon, city) {
        let url = `https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=es&appid=${this.apiKey}`;
        url += city ? `&q=${encodeURIComponent(city)}` : `&lat=${lat}&lon=${lon}`;
        
        console.log(`WeatherService: Solicitando pronóstico extendido a: ${url}`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error Pronóstico: ${response.status}`);
        return await response.json();
    }

    /**
     * Filtra la lista de 40 marcas de tiempo (cada 3 horas) para extraer solo 5 días únicos.
     */
    filterDailyForecast(forecastList) {
        const dailyData = [];
        const vistas = new Set();

        for (const item of forecastList) {
            // Extraemos la fecha (YYYY-MM-DD) ignorando las horas
            const fecha = item.dt_txt.split(' ')[0];
            
            // Tomamos el primer registro de cada día único para construir la semana
            if (!vistas.has(fecha) && dailyData.length < 5) {
                vistas.add(fecha);
                dailyData.push(item);
            }
        }
        console.log("WeatherService: Pronóstico semanal filtrado a 5 días únicos:", dailyData);
        return dailyData;
    }
}


/**
 * CONTROLADOR: Capa encargada de la UI, control de eventos del DOM, reloj y animaciones.
 */
class WeatherController {
    constructor() {
        // Instancia del servicio inyectando la API Key del usuario
        this.weatherService = new WeatherService('47d5ecbf2f7b0195c014429678910d2a'); 
        
        // Elementos de la interfaz de usuario
        this.bodyNode = document.body;
        this.citySelector = document.getElementById('city-selector');
        this.weatherContainer = document.getElementById('weather-container'); 
        this.locationName = document.getElementById('location-name');
        this.clockDisplay = document.getElementById('clock-display'); 
        this.temperature = document.getElementById('temperature');
        this.weatherDescription = document.getElementById('weather-description');
        this.widgetsGrid = document.getElementById('widgets-grid');
        this.forecastContainer = document.getElementById('forecast-container');

        // Offset de zona horaria por defecto (sistema local)
        this.timezoneOffset = -new Date().getTimezoneOffset() * 60;

        console.log("WeatherController: Inicializado con arquitectura desacoplada.");
        this.init();
    }

    init() {
        this.citySelector.addEventListener('change', (e) => this.handleCityChange(e));
        setInterval(() => this.updateClock(), 1000);
        this.updateClock(); 
        this.loadDefaultLocation();
    }

    updateClock() {
        const ahora = new Date();
        const utc = ahora.getTime() + (ahora.getTimezoneOffset() * 60000);
        const horaLocal = new Date(utc + (this.timezoneOffset * 1000));
        
        const opciones = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        this.clockDisplay.textContent = horaLocal.toLocaleTimeString('es-ES', opciones);
    }

    loadDefaultLocation() {
        console.log("WeatherController: Cargando geolocalización o caché...");
        const cachedLat = localStorage.getItem('weather_lat');
        const cachedLon = localStorage.getItem('weather_lon');

        if (cachedLat && cachedLon) {
            this.executeQuery(cachedLat, cachedLon, null);
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    localStorage.setItem('weather_lat', pos.coords.latitude);
                    localStorage.setItem('weather_lon', pos.coords.longitude);
                    this.executeQuery(pos.coords.latitude, pos.coords.longitude, null);
                },
                () => this.executeQuery(null, null, "Madrid,ES")
            );
        } else {
            this.executeQuery(null, null, "Madrid,ES");
        }
    }

    handleCityChange(event) {
        const targetValue = event.target.value;
        console.log(`WeatherController: Cambio a ciudad: ${targetValue}. Lanzando animaciones.`);

        this.bodyNode.classList.add('bg-changing');
        this.weatherContainer.classList.remove('slide-in');
        this.weatherContainer.classList.add('slide-out');

        setTimeout(() => {
            if (targetValue === 'auto') {
                this.timezoneOffset = -new Date().getTimezoneOffset() * 60;
                this.loadDefaultLocation();
            } else {
                this.executeQuery(null, null, targetValue);
            }
        }, 400); 
    }

    /**
     * Orquesta la petición concurrente de los servicios y maneja las excepciones.
     */
    async executeQuery(lat, lon, city) {
        try {
            // Petición paralela usando Promesas para optimizar tiempos de carga
            const [currentData, forecastData] = await Promise.all([
                this.weatherService.fetchCurrentWeather(lat, lon, city),
                this.weatherService.fetchForecast(lat, lon, city)
            ]);

            this.renderAll(currentData, forecastData);
        } catch (error) {
            console.error("WeatherController: Fallo al renderizar consulta:", error.message);
            this.locationName.textContent = "Error de conexión";
            
            this.bodyNode.classList.remove('bg-changing');
            this.weatherContainer.classList.remove('slide-out');
            this.weatherContainer.classList.add('slide-in');
        }
    }

    /**
     * Renderiza por completo todas las secciones del DOM con los nuevos datos procesados.
     */
    renderAll(current, forecast) {
        // 1. Procesar Datos de la Ciudad Actual
        const tempActual = Math.round(current.main.temp);
        const estadoClima = current.weather[0].main.toLowerCase(); 
        const descripcion = current.weather[0].description;
        const ciudad = current.name;

        this.timezoneOffset = current.timezone; 
        this.updateClock(); 
        
        const urlIcono = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
        this.locationName.textContent = ciudad;
        this.temperature.textContent = tempActual;

        const textoDesc = descripcion.charAt(0).toUpperCase() + descripcion.slice(1);
        this.weatherDescription.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 2px; flex-direction: column;">
                <img src="${urlIcono}" alt="${textoDesc}" style="width: 70px; height: 70px; filter: drop-shadow(1px 2px 3px rgba(0,0,0,0.15));">
                <span style="font-weight: 500; margin-top: -10px;">${textoDesc}</span>
            </div>
        `;

        // 2. Renderizar Bloque de Widgets Inteligentes (Puntos 1, 2, 3 y 4)
        const feelsLike = Math.round(current.main.feels_like);
        const humidity = current.main.humidity;
        const visibilityKm = (current.visibility / 1000).toFixed(1);
        const windSpeed = Math.round(current.wind.speed * 3.6); // Conversión de m/s a km/h
        const windDeg = current.wind.deg || 0;

        this.widgetsGrid.innerHTML = `
            <div class="widget-item">
                <span class="widget-title">Sensación</span>
                <span class="widget-value">${feelsLike}°C</span>
            </div>
            <div class="widget-item">
                <span class="widget-title">Viento</span>
                <span class="widget-value">
                    ${windSpeed} km/h 
                    <span class="wind-arrow" style="transform: rotate(${windDeg}deg);">➔</span>
                </span>
            </div>
            <div class="widget-item">
                <span class="widget-title">Humedad</span>
                <span class="widget-value">${humidity}%</span>
            </div>
            <div class="widget-item">
                <span class="widget-title">Visibilidad</span>
                <span class="widget-value">${visibilityKm} km</span>
            </div>
        `;

        // 3. Renderizar Lista del Pronóstico de la Semana (Destacando el día de hoy)
        const listaFiltrada = this.weatherService.filterDailyForecast(forecast.list);
        this.forecastContainer.innerHTML = ''; // Limpiar contenedor previo

        listaFiltrada.forEach((dia, index) => {
            const timestamp = dia.dt * 1000;
            const objetoFecha = new Date(timestamp);
            
            // Formatear el nombre del día en formato corto (lun, mar, mié...)
            let nombreDia = objetoFecha.toLocaleDateString('es-ES', { weekday: 'short' });
            nombreDia = nombreDia.replace('.', ''); // Sanitizar puntos en strings devueltos por algunos navegadores

            const tempDia = Math.round(dia.main.temp);
            const iconoDia = `https://openweathermap.org/img/wn/${dia.weather[0].icon}.png`;

            // Creación del nodo de UI para cada día
            const itemDia = document.createElement('div');
            itemDia.classList.add('forecast-item');
            
            // SOBRESALTADO: Si es el índice 0, corresponde al estado meteorológico del día actual en curso
            if (index === 0) {
                itemDia.classList.add('today-highlight');
                nombreDia = "Hoy";
            }

            itemDia.innerHTML = `
                <span class="forecast-day">${nombreDia.toUpperCase()}</span>
                <img src="${iconoDia}" alt="clima" class="forecast-icon">
                <span class="forecast-temp">${tempDia}°C</span>
            `;
            this.forecastContainer.appendChild(itemDia);
        });

        // 4. Cambios de Atributos de Estilos y Fondos en el Body
        let rangoTemp = 'mild'; 
        if (tempActual > 25) rangoTemp = 'hot';  
        else if (tempActual < 10) rangoTemp = 'cold'; 

        let claseClima = estadoClima;
        if (claseClima === 'drizzle' || claseClima === 'thunderstorm') claseClima = 'rain'; 

        let ciudadNormalizada = ciudad.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        let identificadorCiudad = 'default';
        
        if (ciudadNormalizada.includes('madrid')) identificadorCiudad = 'madrid';
        else if (ciudadNormalizada.includes('london') || ciudadNormalizada.includes('londres')) identificadorCiudad = 'london';
        else if (ciudadNormalizada.includes('moscu') || ciudadNormalizada.includes('moscow')) identificadorCiudad = 'moscu';
        else if (ciudadNormalizada.includes('washington')) identificadorCiudad = 'washington';
        else if (ciudadNormalizada.includes('brasilia')) identificadorCiudad = 'brasilia';
        else if (ciudadNormalizada.includes('pekin') || ciudadNormalizada.includes('beijing')) identificadorCiudad = 'pekin';
        else if (ciudadNormalizada.includes('delhi')) identificadorCiudad = 'delhi';
        else if (ciudadNormalizada.includes('tokyo') || ciudadNormalizada.includes('tokio')) identificadorCiudad = 'tokyo';
        else if (ciudadNormalizada.includes('cairo')) identificadorCiudad = 'cairo';
        else if (ciudadNormalizada.includes('canberra')) identificadorCiudad = 'canberra';

        this.bodyNode.setAttribute('data-weather', claseClima);
        this.bodyNode.setAttribute('data-temp', rangoTemp);
        this.bodyNode.setAttribute('data-city', identificadorCiudad);

        // Quitar filtros de transición y reintroducir la tarjeta
        this.bodyNode.classList.remove('bg-changing');
        this.weatherContainer.classList.remove('slide-out');
        this.weatherContainer.classList.add('slide-in');
    }
}

// Inicialización de la aplicación
const weatherApp = new WeatherController();