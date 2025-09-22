function executeCode(exerciseNumber) {
    // Obtener el código del textarea correspondiente al ejercicio
    var code = document.getElementById('code' + exerciseNumber).value;

    try {
        // Ejecutar el código
        var result = eval(code);

        // Mostrar el resultado en el div de salida correspondiente al ejercicio
        document.getElementById('output' + exerciseNumber).innerText = result;
    } catch (error) {
        // Mostrar el error en caso de que ocurra
        document.getElementById('output' + exerciseNumber).innerText = 'Error: ' + error.message;
    }
}
