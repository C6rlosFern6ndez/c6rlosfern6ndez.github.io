/**
 * Clase controladora principal para la gestión del clima, geolocalización, reloj y transiciones de UI.
 */
class WeatherController {
    constructor() {
        // Clave de API de OpenWeatherMap extraída del panel del usuario
        this.apiKey = '47d5ecbf2f7b0195c014429678910d2a'; 
        
        // Mapeo de nodos del DOM necesarios para la aplicación
        this.bodyNode = document.body;
        this.citySelector = document.getElementById('city-selector');
        this.weatherContainer = document.getElementById('weather-container'); 
        this.locationName = document.getElementById('location-name');
        this.clockDisplay = document.getElementById('clock-display'); 
        this.temperature = document.getElementById('temperature');
        this.weatherDescription = document.getElementById('weather-description');

        // Inicializamos el offset con la zona horaria local del navegador (en segundos)
        this.timezoneOffset = -new Date().getTimezoneOffset() * 60;

        console.log("WeatherController: Constructor ejecutado. Componentes y transiciones de fondo vinculados.");
        this.init();
    }

    /**
     * Inicializa los escuchadores de eventos, el reloj en tiempo real y activa la geolocalización.
     */
    init() {
        console.log("WeatherController: Inicializando la aplicación y registrando eventos...");
        
        this.citySelector.addEventListener('change', (e) => this.handleCityChange(e));
        
        setInterval(() => this.updateClock(), 1000);
        this.updateClock(); 

        this.loadDefaultLocation();
    }

    /**
     * Calcula y renderiza la hora exacta basándose en el desplazamiento UTC de la ciudad actual.
     */
    updateClock() {
        const ahora = new Date();
        const utcMilisegundos = ahora.getTime() + (ahora.getTimezoneOffset() * 60000);
        const horaLocalCiudad = new Date(utcMilisegundos + (this.timezoneOffset * 1000));
        
        const opciones = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        this.clockDisplay.textContent = horaLocalCiudad.toLocaleTimeString('es-ES', opciones);
    }

    /**
     * Intenta obtener las coordenadas del usuario a través de la API del navegador o del caché local.
     */
    loadDefaultLocation() {
        console.log("WeatherController: Solicitando acceso a la Geolocalización...");

        const cachedLat = localStorage.getItem('weather_lat');
        const cachedLon = localStorage.getItem('weather_lon');

        if (cachedLat && cachedLon) {
            this.fetchWeatherData(cachedLat, cachedLon, null);
            return;
        }

        this.locationName.textContent = "Detectando...";
        this.weatherDescription.textContent = "Esperando confirmación de ubicación...";

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    localStorage.setItem('weather_lat', latitude);
                    localStorage.setItem('weather_lon', longitude);
                    this.fetchWeatherData(latitude, longitude, null);
                },
                (error) => {
                    this.fetchWeatherData(null, null, "Madrid,ES");
                }
            );
        } else {
            this.fetchWeatherData(null, null, "Madrid,ES");
        }
    }

    /**
     * Maneja el cambio de selección en el menú desplegable de ciudades aplicando animaciones de salida.
     */
    handleCityChange(event) {
        const targetValue = event.target.value;
        console.log(`WeatherController: Cambio detectado. Iniciando desvanecimiento de fondo y slider.`);

        // NUEVO: Forzamos que la imagen de fondo actual pase a ser transparente (opacidad 0)
        this.bodyNode.classList.add('bg-changing');
        
        // Desplazamos la tarjeta de información hacia la izquierda
        this.weatherContainer.classList.remove('slide-in');
        this.weatherContainer.classList.add('slide-out');

        // Esperamos a que la tarjeta y el fondo terminen su salida (400ms) antes de pedir los datos
        setTimeout(() => {
            this.locationName.textContent = "Cargando...";
            this.temperature.textContent = "--";
            this.weatherDescription.textContent = "Obteniendo datos actualizados del servidor...";

            if (targetValue === 'auto') {
                this.timezoneOffset = -new Date().getTimezoneOffset() * 60;
                this.loadDefaultLocation();
            } else {
                this.fetchWeatherData(null, null, targetValue);
            }
        }, 400); 
    }

    /**
     * Solicita los datos meteorológicos a la API de OpenWeatherMap de manera asíncrona.
     */
    async fetchWeatherData(lat, lon, city) {
        let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lang=es&appid=${this.apiKey}`;
        
        if (city) {
            url += `&q=${encodeURIComponent(city)}`;
        } else {
            url += `&lat=${lat}&lon=${lon}`;
        }
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            
            const data = await response.json();
            this.renderWeather(data);
        } catch (error) {
            console.error("WeatherController: Error en la petición HTTP:", error.message);
            this.locationName.textContent = "Error de conexión";
            this.weatherDescription.textContent = "No se pudieron cargar los datos.";
            
            // CORRECCIÓN DE FLUJO: En caso de error, restauramos la UI para mostrar el mensaje de fallo
            this.bodyNode.classList.remove('bg-changing');
            this.weatherContainer.classList.remove('slide-out');
            this.weatherContainer.classList.add('slide-in');
        }
    }

    /**
     * Procesa los datos de la API, actualiza la UI y gestiona la entrada progresiva del fondo y la tarjeta.
     */
    renderWeather(data) {
        const tempActual = Math.round(data.main.temp);
        const estadoClima = data.weather[0].main.toLowerCase(); 
        const descripcion = data.weather[0].description;
        const ciudad = data.name;

        this.timezoneOffset = data.timezone; 
        this.updateClock(); 
        
        const codigoIcono = data.weather[0].icon;
        const urlIcono = `https://openweathermap.org/img/wn/${codigoIcono}@2x.png`;

        this.locationName.textContent = ciudad;
        this.temperature.textContent = tempActual;

        const textoDescripcion = descripcion.charAt(0).toUpperCase() + descripcion.slice(1);
        this.weatherDescription.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 4px; flex-direction: column;">
                <img src="${urlIcono}" alt="${textoDescripcion}" style="width: 75px; height: 75px; filter: drop-shadow(1px 2px 4px rgba(0,0,0,0.15));">
                <span style="font-weight: 500;">${textoDescripcion}</span>
            </div>
        `;

        let rangoTemp = 'mild'; 
        if (tempActual > 25) rangoTemp = 'hot';  
        else if (tempActual < 10) rangoTemp = 'cold'; 

        let claseClima = estadoClima;
        if (estadoClima === 'drizzle' || estadoClima === 'thunderstorm') claseClima = 'rain'; 

        let nombreCiudadBajo = ciudad.toLowerCase();
        let ciudadNormalizada = nombreCiudadBajo.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

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

        // Mutamos los atributos del body (el cambio de imagen ocurre aquí mientras está invisible)
        this.bodyNode.setAttribute('data-weather', claseClima);
        this.bodyNode.setAttribute('data-temp', rangoTemp);
        this.bodyNode.setAttribute('data-city', identificadorCiudad);

        console.log(`WeatherController: Nueva imagen asignada ("${identificadorCiudad}"). Iniciando fundido de entrada.`);

        // NUEVO: Retiramos la clase para que el CSS haga aparecer la nueva imagen suavemente hasta 0.25
        this.bodyNode.classList.remove('bg-changing');

        // Reintroducimos la tarjeta de información por el lado derecho
        this.weatherContainer.classList.remove('slide-out');
        this.weatherContainer.classList.add('slide-in');
    }
}

const weatherApp = new WeatherController();