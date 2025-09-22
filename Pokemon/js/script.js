document.addEventListener('DOMContentLoaded', function () {
    const baseUrl = 'https://pokeapi.co/api/v2/pokemon';

    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/`;

    let pokemonList = [];
    let numPokemonsPorPagina = 10;
    let favorito = JSON.parse(localStorage.getItem('favorito')) || [];
    let page = 1;
    let totalPokemon = 0;

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const resetBtn = document.getElementById('resetBtn');
    const appContainer = document.getElementById('app');
    const verFavoritos = document.createElement("button");
    const buttonBack = document.createElement('button');
    const counter = document.createElement('input');
    const mensajeEmergente = document.createElement('p');


    /**
     * Función asíncrona que obtiene la lista de Pokémon desde la API
     * y guarda los datos en local.
     * 
     * @param {string} url URL de la API con la lista de Pokémon
     * @returns {Promise<Array>} Promesa con la lista de Pokémon
     */
    async function obtenerPokemonList(url) {
        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();
            totalPokemon = data.count;
            pokemonList = data.results;
            guardarEnLocal();
            return data.results;
        } catch (error) {
            console.error("Error al obtener la lista de Pokémon: ", error);
        }
    }


    /**
     * Función que guarda la lista de Pokémon en el almacenamiento local del navegador.
     * Si la lista es undefined no guarda nada y muestra un mensaje de advertencia.
     * En caso de error, muestra el error en la consola.
     */
    function guardarEnLocal() {
        //let data;
        if (pokemonList) {
            try {
                localStorage.setItem('pokemonList', JSON.stringify(pokemonList));
                //data = localStorage.getItem('pokemonList');
                //console.log('Lista en Local: ', data);
            } catch (error) {
                console.error("Error al guardar en el almacenamiento local: ", error);
            }
        } else {
            console.warn("Lista de Pokémon indefinida, no se guarda nada en el almacenamiento local");
        }
        //return data;
    }


    function createCounter() {
        /*
         * Crea un elemento de tipo entrada de número que permita al usuario
         * cambiar la cantidad de pokémon mostrados por página.
         * Se posiciona al lado del contenedor de los pokémon y se le da
         * algunos estilos para que se vea bien.
         */
        counter.type = 'number';
        counter.id = 'counter';
        counter.value = numPokemonsPorPagina;
        appContainer.parentNode.insertBefore(counter, appContainer);

        counter.style.margin = 'auto 2em'
        counter.style.width = '3em';
        counter.style.padding = '0.5em';
        counter.style.fontSize = '1em';
        counter.style.fontWeight = 'bold';
        counter.style.opacity = '0.8';
        counter.style.border = '2px solid #f37021';
        counter.style.borderRadius = '5px';
    }
    createCounter();

    /**
     * Crea la URL de la imagen del pokémon a partir de la URL que
     * se recibe como parámetro.
     * 
     * La función extrae el id del pokémon a partir de la URL y lo
     * concatena con la URL base de las imágenes de los pokémon, que
     * se almacena en la variable 'imageUrl'.
     * @param {string} url URL completa de la página del pokémon
     * @return {string} URL de la imagen del pokémon
     */
    function obtenerImageUrl(url) {
        const pokemonId = url.split("/")[6];
        return `${imageUrl}${pokemonId}.png`;
    }


    /**
     * Borra todo el contenido del contenedor que contiene los pokémon.
     * Este método se utiliza para limpiar el contenedor cada vez que se
     * cambia de página o cuando se agrega o elimina un pokémon de la lista
     * de favoritos.
     */
    function limpiarContenedor() {
        appContainer.innerHTML = "";
    }


    /**
     * Crea y agrega al contenedor del app el botón de ver favoritos.
     * Este botón se utiliza para mostrar los pokémon que se han agregado
     * a la lista de favoritos. Se posiciona en la esquina inferior derecha
     * de la pantalla y tiene un diseño básico con estilo de borde redondeado,
     * color de fondo y texto en blanco.
     */
    function createFavoritesButton() {
        verFavoritos.textContent = "Ver Favoritos";
        verFavoritos.style.position = "fixed";
        verFavoritos.style.bottom = "2em";
        verFavoritos.style.right = "2em";
        verFavoritos.style.borderRadius = "5px";
        verFavoritos.style.color = "white";
        verFavoritos.style.backgroundColor = "#f37021";
        verFavoritos.style.fontSize = "1.2em";
        verFavoritos.style.padding = "0.3em";
        appContainer.appendChild(verFavoritos);
    }

    createFavoritesButton();

    /**
     * Crea y agrega al contenedor del app el botón de volver.
     * Este botón se utiliza para permitir al usuario volver a la página de inicio
     * desde cualquier página de detalle de pokémon. Se posiciona en la esquina
     * inferior derecha de la pantalla y tiene un diseño básico con estilo de
     * borde redondeado, color de fondo y texto en blanco.
     */
    function createButtonBack() {
        buttonBack.textContent = "Volver";
        buttonBack.style.position = "fixed";
        buttonBack.style.bottom = "2em";
        buttonBack.style.right = "45%";
        buttonBack.style.borderRadius = "5px";
        buttonBack.style.color = "white";
        buttonBack.style.backgroundColor = "#f37021";
        buttonBack.style.fontSize = "1.2em";
        buttonBack.style.padding = "0.3em";
        appContainer.appendChild(buttonBack);
    }



    function createPokemonCard(pokemon) {
        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'pokemon-card';
        pokemonCard.style.width = '13%';
        pokemonCard.style.margin = '1em';
        pokemonCard.style.padding = '0 1em';
        pokemonCard.style.textAlign = 'center';
        pokemonCard.style.border = '2px solid #ccc';
        pokemonCard.style.backgroundColor = 'white';

        createPokemonImage(pokemon, pokemonCard);
        createFavoriteCheckbox(pokemon, pokemonCard);
        createPokemonName(pokemon, pokemonCard);


        pokemonCard.addEventListener('mouseover', function () {
            pokemonCard.style.border = '2px solid #f37021';
            pokemonCard.style.backgroundColor = '#f8f8f8';
            pokemonCard.style.cursor = 'pointer';
            //console.log(pokemon.name);
            searchInput.value = pokemon.name;
        });

        pokemonCard.addEventListener('mouseout', function () {
            pokemonCard.style.border = '2px solid #ccc';
            pokemonCard.style.backgroundColor = 'white';
            pokemonCard.style.cursor = 'default';
            searchInput.value = '';
        });

        pokemonCard.addEventListener('click', function () {
            searchPokemon(pokemon.name);
        })

        return pokemonCard;
    }

    /**
     * Muestra en el contenedor del app la lista de pokémon guardados en
     * la lista de favoritos. Crea una tarjeta de pokémon para cada uno de
     * ellos y muestra su imagen en miniatura. Se utiliza para mostrar los
     * pokémon que se han agregado a la lista de favoritos.
     */
    function mostrarContenidoFavoritos() {
        limpiarContenedor();

        favorito.forEach((pokemon) => {
            const pokemonCard = createPokemonCard(pokemon);
            const pokemonImage = document.createElement("img");
            pokemonImage.src = pokemon.url;
            pokemonImage.alt = "";
            pokemonImage.className = "pokemon-image";
            pokemonImage.style.maxWidth = "100%";
            pokemonImage.style.height = "auto";
            pokemonCard.appendChild(pokemonImage);

            appContainer.appendChild(pokemonCard);
        });
    }


    /**
     * Crea y agrega al contenedor del elemento pasado por parámetro
     * una imagen del pokémon que se le pasa como parámetro. La imagen
     * se encuentra en la propiedad 'url' del objeto pokémon y se
     * obtiene llamando a la función 'obtenerImageUrl' para obtener la
     * URL completa de la imagen del pokémon.
     */
    function createPokemonImage(pokemon, container) {
        const pokemonImage = document.createElement("img");
        pokemonImage.src = obtenerImageUrl(pokemon.url);
        pokemonImage.alt = "";
        pokemonImage.className = "pokemon-image";
        pokemonImage.style.maxWidth = "100%";
        pokemonImage.style.height = "auto";
        container.appendChild(pokemonImage);
    }


    /**
     * Crea y agrega al contenedor del elemento pasado por parámetro
     * un elemento <p> con el nombre del pokémon que se le pasa como
     * parámetro. El nombre se encuentra en la propiedad 'name' del
     * objeto pokémon y se muestra en negrita y de tamaño 1.2em.
     */
    function createPokemonName(pokemon, container) {
        const pokemonName = document.createElement("p");
        pokemonName.className = "pokemon-name";
        pokemonName.style.fontWeight = "bold";
        pokemonName.style.fontSize = "1.2em";
        pokemonName.textContent = pokemon.name;
        container.appendChild(pokemonName);
    }

    /**
     * Crea un checkbox para marcar un pokémon como favorito.
     * Al marcar el checkbox se guarda en el local storage el nombre
     * del pokémon como favorito. Al desmarcar el checkbox se elimina
     * el pokémon de la lista de favoritos.
     */
    function createFavoriteCheckbox(pokemon, container) {
        const selectPokemon = document.createElement("input");
        selectPokemon.type = "checkbox";
        selectPokemon.id = `pokemonCheckbox_${pokemon.name}`;
        const pokemonKey = pokemon.name;
        const isSelected = localStorage.getItem(pokemonKey) === 'true';
        selectPokemon.checked = isSelected;

        selectPokemon.addEventListener('change', function () {
            const isSelected = selectPokemon.checked;

            if (isSelected) {
                agregarFavorito(pokemon);
            } else {
                eliminarFavorito(pokemon);
            }
        });
        container.appendChild(selectPokemon);
    }


    /**
     * Muestra en el contenedor del app la lista de pokémon de la página actual
     * de la lista completa de pokémon obtenidos de la API. Crea una tarjeta de
     * pokémon para cada uno de ellos y los agrega al contenedor. También crea el
     * botón de ver favoritos y deshabilita los botones de navegación si se encuentra
     * en la primera o en la última página de la lista.
     */
    function mostrarPokemonList(pokemonList) {
        limpiarContenedor();
        createFavoritesButton();

        pokemonList.forEach((pokemon) => {
            const pokemonCard = createPokemonCard(pokemon);
            appContainer.appendChild(pokemonCard);
        });

        prevBtn.disabled = page <= 1;
        nextBtn.disabled = page >= Math.ceil(totalPokemon / numPokemonsPorPagina);
    }

    /**
     * Crea un checkbox para marcar un pokémon como favorito. Al marcar el
     * checkbox se guarda en el local storage el nombre del pokémon como
     * favorito. Al desmarcar el checkbox se elimina el pokémon de la lista
     * de favoritos.
     */
    function checkFavorito(pokemon) {
        const selectPokemon = document.createElement("input");
        selectPokemon.type = "checkbox";
        selectPokemon.id = `pokemonCheckbox_${pokemon.name}`;

        const pokemonKey = pokemon.name;
        const isSelected = localStorage.getItem(pokemonKey) === 'true';
        selectPokemon.checked = isSelected;

        selectPokemon.addEventListener('change', function () {
            const isSelected = selectPokemon.checked;

            if (isSelected) {
                agregarFavorito(pokemon);
            } else {
                eliminarFavorito(pokemon);
            }
        });

        return selectPokemon;
    }


    async function searchPokemon() {
        const pokemonName = searchInput.value.toLowerCase();
        if (pokemonName) {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                const data = await response.json();
                const imageUrl = data.sprites.other.dream_world.front_default;
                mostrarPokemonImage(imageUrl);

                // Función auxiliar para manejar datos nulos o indefinidos
                const obtenerDato = (dato) => dato ? dato : 'Ninguna';

                // Información básica del Pokémon
                const habilidad = obtenerDato(data.abilities[0]?.ability.name);
                const habilidad2 = obtenerDato(data.abilities[1]?.ability.name);
                const tipo = obtenerDato(data.types[0]?.type.name);
                const tipo2 = obtenerDato(data.types[1]?.type.name);

                // Crear elementos <p> y <div> para mostrar la información
                const contenedorTexto = document.createElement('div');
                const pHabilidad = document.createElement('p');
                const pHabilidad2 = document.createElement('p');
                const pTipo = document.createElement('p');
                const pTipo2 = document.createElement('p');

                // Asignar texto a los elementos <p>
                pHabilidad.innerText = `Habilidad: ${habilidad}`;
                pHabilidad2.innerText = `Habilidad-2: ${habilidad2}`;
                pTipo.innerText = `Tipo: ${tipo}`;
                pTipo2.innerText = `Tipo-2: ${tipo2}`;


                // Añadir elementos al contenedor principal (appContainer)
                appContainer.appendChild(contenedorTexto);
                contenedorTexto.appendChild(pHabilidad);
                contenedorTexto.appendChild(pHabilidad2);
                contenedorTexto.appendChild(pTipo);
                contenedorTexto.appendChild(pTipo2);

                createButtonBack();

            } catch (error) {
                console.error("Error al buscar el Pokémon: ", error);
                mensajeEmergente.style.transition = "opacity 1s";
                mensajeEmergente.style.opacity = "1";
                setTimeout(() => {
                    mensajeEmergente.style.transition = "opacity 1s";
                    mensajeEmergente.style.opacity = "0";
                }, 4000);
            }
        } else {
            console.log("Pokémon no encontrado");
        }
    }




    searchBtn.addEventListener('click', async () => {
        await searchPokemon(searchInput.value);
    });



    /**
     * Crea un mensaje de alerta para indicar que el Pokémon
     * buscado no se encuentra en la API. Este mensaje se
     * muestra en la parte superior de la aplicación, justo
     * debajo del contenedor principal (appContainer).
     */
    async function mensaje() {
        mensajeEmergente.type = "text";
        mensajeEmergente.id = "mensajeEmergente";
        mensajeEmergente.textContent = "Pokémon no encontrado";
        appContainer.parentNode.insertBefore(mensajeEmergente, appContainer);

        mensajeEmergente.style.textAlign = "center";
        mensajeEmergente.style.backgroundColor = "#f37021";
        mensajeEmergente.style.color = "white";
        mensajeEmergente.style.fontSize = "1.5em";
        mensajeEmergente.style.padding = "0";
        mensajeEmergente.style.margin = "0";
        mensajeEmergente.style.fontWeight = "bold";
        mensajeEmergente.style.opacity = "0";
    }
    mensaje();

    /**
     * Muestra la imagen del Pokémon en una página de detalle.
     *
     * Crea un elemento IMG con la imagen del Pokémon y la agrega
     * al contenedor principal (appContainer) de la aplicación.
     * Establece algunas propiedades CSS para que la imagen se
     * muestre de forma adecuada.
     */
    function mostrarPokemonImage(imageUrl) {
        limpiarContenedor();
        const pokemonImage = document.createElement("img");
        pokemonImage.src = imageUrl;
        pokemonImage.alt = "";
        pokemonImage.className = "pokemon-image";
        pokemonImage.style.maxWidth = "100%";
        pokemonImage.style.height = "auto";
        appContainer.appendChild(pokemonImage);
    }


    /**
     * Agrega un Pokémon a la lista de favoritos.
     *
     * Agrega el Pokémon al array favorito, estableciendo su nombre y
     * la URL de su imagen, y guarda la lista de favoritos en el
     * localStorage con el nombre de clave 'favorito'.
     */
    function agregarFavorito(pokemon) {
        favorito.push({
            name: pokemon.name,
            url: obtenerImageUrl(pokemon.url)
        });
        localStorage.setItem(pokemon.name, 'true');
        localStorage.setItem('favorito', JSON.stringify(favorito));
    }


    /**
     * Elimina un Pokémon de la lista de favoritos.
     *
     * Busca en el array de favoritos un Pokémon con el nombre pasado
     * como parámetro y lo elimina. También elimina la clave con el nombre
     * del Pokémon en el localStorage, y actualiza la clave 'favorito'
     * con la lista de favoritos actualizada.
     */
    function eliminarFavorito(pokemon) {
        favorito = favorito.filter(fav => fav.name !== pokemon.name);
        localStorage.removeItem(pokemon.name);
        localStorage.setItem('favorito', JSON.stringify(favorito));
    }


    /**
     * Navega por la lista de Pokémon utilizando la paginación.
     *
     * Esta función se encarga de cambiar de página en la lista de Pokémon
     * utilizando la paginación. Recibe como parámetro la opción de navegación
     * (prev o next) y realiza una petición a la API para obtener la lista
     * de Pokémon correspondiente a la página actual. Una vez obtenida la
     * lista, se llama a la función que muestra los Pokémon en el contenedor
     * del app.
     */
    async function paginationPokemons(option) {
        try {
            if (option === 'prev' && page > 1) {
                page--;
            } else if (option === 'next' && page < Math.ceil(totalPokemon / numPokemonsPorPagina)) {
                page++;
            }
            const offset = (page - 1) * numPokemonsPorPagina;
            const pokemonList = await obtenerPokemonList(`${baseUrl}?limit=${numPokemonsPorPagina}&offset=${offset}`);

            if (!pokemonList) {
                throw new Error("No se pudo obtener la lista de Pokémon.");
            }

            mostrarPokemonList(pokemonList);
        } catch (error) {
            console.error("Error en paginationPokemons: ", error);
        }
    }


    // Agregar un event listener para el evento 'change' en counter
    counter.addEventListener('change', async () => {
        // Actualizar numPokemonsPorPagina con el nuevo valor de counter
        numPokemonsPorPagina = counter.value;
        // Restablecer la página a 1
        page = 1;
        // Obtener la lista de pokemons con el límite actualizado usando la función obtenerPokemonList
        const pokemonList = await obtenerPokemonList(`${baseUrl}?limit=${numPokemonsPorPagina}`);
        // Mostrar la lista de pokemons obtenida
        mostrarPokemonList(pokemonList);
    })
    prevBtn.addEventListener('click', () => paginationPokemons('prev'));
    nextBtn.addEventListener('click', () => paginationPokemons('next'));

    resetBtn.addEventListener('click', async () => {
        page = 1;
        const pokemonList = await obtenerPokemonList(`${baseUrl}?limit=${numPokemonsPorPagina}`);
        mostrarPokemonList(pokemonList);
    });


    verFavoritos.addEventListener('click', function () {
        console.log('Favoritos: ', favorito)
        mostrarContenidoFavoritos();
    });

    buttonBack.addEventListener('click', function () {
        init();
    });

    /**
     * Función inicial que se ejecuta al cargar la página. Comprueba si en el
     * localStorage existe la lista de pokémon, si existe la muestra en el
     * contenedor del app, si no existe la obtiene de la API, la muestra y
     * la guarda en el localStorage.
     */
    async function init() {
        const localPokemonList = localStorage.getItem('pokemonList');

        if (localPokemonList) {
            pokemonList = JSON.parse(localPokemonList);
            mostrarPokemonList(pokemonList);
        } else {
            const pokemonList = await obtenerPokemonList(`${baseUrl}?limit=${numPokemonsPorPagina}`);
            mostrarPokemonList(pokemonList);
            guardarListaEnLocalStorage();
        }
        //console.log(pokemonList);
    }


    init();
});
