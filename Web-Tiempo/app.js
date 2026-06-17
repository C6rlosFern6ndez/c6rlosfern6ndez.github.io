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
            const fecha = item.dt_txt.split(' ')[0]; // Extrae formato YYYY-MM-DD
            
            if (!vistas.has(fecha) && dailyData.length < 5) {
                vistas.add(fecha);
                dailyData.push(item);
            }
        }
        console.log("WeatherService: Pronóstico semanal filtrado a 5 días:", dailyData);
        return dailyData;
    }
}


/**
 * CONTROLADOR: Capa encargada de la UI, control de eventos del DOM, reloj y animaciones.
 */
class WeatherController {
    constructor() {
        // Inyección de la API Key del usuario
        this.weatherService = new WeatherService('47d5ecbf2f7b0195c014429678910d2a'); 
        
        // Elementos de la interfaz de usuario (DOM)
        this.bodyNode = document.body;
        this.citySelector = document.getElementById('city-selector');
        this.weatherContainer = document.getElementById('weather-container'); 
        this.locationName = document.getElementById('location-name');
        this.clockDisplay = document.getElementById('clock-display'); 
        this.temperature = document.getElementById('temperature');
        this.weatherDescription = document.getElementById('weather-description');
        this.widgetsGrid = document.getElementById('widgets-grid');
        this.forecastContainer = document.getElementById('forecast-container');

        // Desplazamiento horario por defecto (sistema local)
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
        console.log("WeatherController: Cargando geolocalización o datos por defecto...");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => this.executeQuery(pos.coords.latitude, pos.coords.longitude, null),
                () => this.executeQuery(null, null, "Madrid,ES")
            );
        } else {
            this.executeQuery(null, null, "Madrid,ES");
        }
    }

    handleCityChange(event) {
        const targetValue = event.target.value;
        console.log(`WeatherController: Evento 'change' detectado -> ${targetValue}`);

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

    async executeQuery(lat, lon, city) {
        try {
            // Petición asíncrona en paralelo para optimizar la velocidad de carga
            const [currentData, forecastData] = await Promise.all([
                this.weatherService.fetchCurrentWeather(lat, lon, city),
                this.weatherService.fetchForecast(lat, lon, city)
            ]);

            console.log("WeatherController: Respuestas HTTP decodificadas con éxito.");
            this.renderAll(currentData, forecastData);
        } catch (error) {
            console.error("WeatherController: Error crítico en la consulta general:", error.message);
            this.locationName.textContent = "Error de conexión";
            this.weatherDescription.textContent = "No se pudieron cargar los datos.";
            
            this.bodyNode.classList.remove('bg-changing');
            this.weatherContainer.classList.remove('slide-out');
            this.weatherContainer.classList.add('slide-in');
        }
    }

    /**
     * Auxiliar para formatear marcas de tiempo UNIX adaptadas al huso horario de la ciudad de destino.
     */
    formatLocalTimeFromTimestamp(unixSeconds, offsetSeconds) {
        const fechaUnix = new Date(unixSeconds * 1000);
        const utc = fechaUnix.getTime() + (fechaUnix.getTimezoneOffset() * 60000);
        const fechaLocal = new Date(utc + (offsetSeconds * 1000));
        return fechaLocal.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    renderAll(current, forecast) {
        // 1. Desestructuración y procesamiento de datos principales
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

        // 2. Procesamiento de los 6 Widgets Avanzados (Incluyendo Amanecer y Atardecer corregidos por zona horaria)
        const feelsLike = Math.round(current.main.feels_like);
        const humidity = current.main.humidity;
        const visibilityKm = (current.visibility / 1000).toFixed(1);
        const windSpeed = Math.round(current.wind.speed * 3.6); 
        const windDeg = current.wind.deg || 0;

        const amanecerLocal = this.formatLocalTimeFromTimestamp(current.sys.sunrise, this.timezoneOffset);
        const atardecerLocal = this.formatLocalTimeFromTimestamp(current.sys.sunset, this.timezoneOffset);

        console.log(`WeatherController: Horarios calculados -> Amanecer: ${amanecerLocal}, Atardecer: ${atardecerLocal}`);

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
            <div class="widget-item">
                <span class="widget-title">Amanecer</span>
                <span class="widget-value">🌅 ${amanecerLocal}</span>
            </div>
            <div class="widget-item">
                <span class="widget-title">Atardecer</span>
                <span class="widget-value">🌇 ${atardecerLocal}</span>
            </div>
        `;

        // 3. Renderizar Pronóstico Semanal destacando el día de hoy
        const listaFiltrada = this.weatherService.filterDailyForecast(forecast.list);
        this.forecastContainer.innerHTML = ''; 

        listaFiltrada.forEach((dia, index) => {
            const objetoFecha = new Date(dia.dt * 1000);
            let nombreDia = objetoFecha.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');

            const tempDia = Math.round(dia.main.temp);
            const iconoDia = `https://openweathermap.org/img/wn/${dia.weather[0].icon}.png`;

            const itemDia = document.createElement('div');
            itemDia.classList.add('forecast-item');
            
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

        // 4. Mutar Atributos semánticos en el Body para CSS
        let rangoTemp = 'mild'; 
        if (tempActual > 25) rangoTemp = 'hot';  
        else if (tempActual < 10) rangoTemp = 'cold'; 

        let claseClima = estadoClima;
        if (claseClima === 'drizzle' || claseClima === 'thunderstorm') claseClima = 'rain'; 

        let ciudadNorm = ciudad.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        let idCiudad = 'default';
        if (ciudadNorm.includes('madrid')) idCiudad = 'madrid';
        else if (ciudadNorm.includes('london') || ciudadNorm.includes('londres')) idCiudad = 'london';
        else if (ciudadNorm.includes('moscu') || ciudadNorm.includes('moscow')) idCiudad = 'moscu';
        else if (ciudadNorm.includes('washington')) idCiudad = 'washington';
        else if (ciudadNorm.includes('brasilia')) idCiudad = 'brasilia';
        else if (ciudadNorm.includes('tokyo') || ciudadNorm.includes('tokio')) idCiudad = 'tokyo';
        else if (ciudadNorm.includes('cairo')) idCiudad = 'cairo';
        else if (ciudadNorm.includes('canberra')) idCiudad = 'canberra';

        this.bodyNode.setAttribute('data-weather', claseClima);
        this.bodyNode.setAttribute('data-temp', rangoTemp);
        this.bodyNode.setAttribute('data-city', idCiudad);

        // Finalizar transiciones e inyectar tarjeta
        this.bodyNode.classList.remove('bg-changing');
        this.weatherContainer.classList.remove('slide-out');
        this.weatherContainer.classList.add('slide-in');
    }
}

const weatherApp = new WeatherController();