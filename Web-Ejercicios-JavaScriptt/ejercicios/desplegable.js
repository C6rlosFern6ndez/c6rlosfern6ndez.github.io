
function desplegable(){
    const ejerciciosLi = document.getElementById('ejercicios');

const menuDesplegable = ejerciciosLi.querySelector('ul');


ejerciciosLi.addEventListener('click', function () {

    if (menuDesplegable.style.display === 'none' || menuDesplegable.style.display === '') {
        menuDesplegable.style.display = 'block';
    } else {
        menuDesplegable.style.display = 'none';
    }
});
}