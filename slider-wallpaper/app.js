
document.addEventListener('DOMContentLoaded', function () {
    // Tu código JavaScript actualizado aquí

    const images = [
        {
            src: 'image/Amanecer entre Montañas.jpg',
            title: 'Amanecer entre Montaña',
            author: 'CARLOS',
            topic: 'WALLPAPER',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, quos, voluptates. Consequuntur, quidem, voluptas. Cumque, quos, voluptates. Consequuntur, quidem, voluptas'
        },
        {
            src: 'image/Calle-antigua-iluminada.png',
            title: 'Calle antiga iluminada',
            author: 'CARLOS',
            topic: 'WALLPAPER',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, quos, voluptates. Consequuntur, quidem, voluptas. Cumque, quos, voluptates. Consequuntur, quidem, voluptas'
        },
        {
            src: 'image/Ciudad en Llamas.jpg',
            title: 'Ciudad en Llamas',
            author: 'CARLOS',
            topic: 'WALLPAPER',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, quos, voluptates. Consequuntur, quidem, voluptas. Cumque, quos, voluptates. Consequuntur, quidem, voluptas'
        },
        {
            src: 'image/Danza Cósmica.jpg',
            title: 'Danza Cósmica',
            author: 'CARLOS',
            topic: 'WALLPAPER',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, quos, voluptates. Consequuntur, quidem, voluptas. Cumque, quos, voluptates. Consequuntur, quidem, voluptas'
        },
        {
            src: 'image/Danza Cósmica2.jpg',
            title: 'Fondo de escritorio',
            author: 'CARLOS',
            topic: 'WALLPAPER',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, quos, voluptates. Consequuntur, quidem, voluptas. Cumque, quos, voluptates. Consequuntur, quidem, voluptas'
        }
        // Agrega más objetos para cada imagen según sea necesario
    ];

    const listDom = document.querySelector('.carousel .list');
    const thumbnailDom = document.querySelector('.carousel .thumbnail');

    images.forEach(image => {
        // Generar elementos de imagen en la sección principal
        const item = document.createElement('div');
        item.classList.add('item');

        const img = document.createElement('img');
        img.src = image.src;

        const content = document.createElement('div');
        content.classList.add('content');

        const title = document.createElement('div');
        title.classList.add('title');
        title.textContent = image.title;

        const author = document.createElement('div');
        author.classList.add('author');
        author.textContent = image.author;

        const description = document.createElement('div');
        description.classList.add('description');
        description.textContent = image.description;    

        const topic = document.createElement('div');
        topic.classList.add('topic');
        topic.textContent = image.topic;

        const buttons = document.createElement('div');
        buttons.classList.add('buttons');

        item.appendChild(img);
        item.appendChild(content);
        content.appendChild(author);
        content.appendChild(title);
        content.appendChild(topic);
        content.appendChild(description);
        content.appendChild(buttons);
        listDom.appendChild(item);


        // Generar elementos de miniatura
        const thumbnailItem = document.createElement('div');
        thumbnailItem.classList.add('item');

        const thumbnailImg = document.createElement('img');
        thumbnailImg.src = image.src;

        const thumbnailContent = document.createElement('div');
        thumbnailContent.classList.add('content');

        const thumbnailTitle = document.createElement('div');
        thumbnailTitle.classList.add('title');
        thumbnailTitle.textContent = image.title;

        const thumbnailDescription = document.createElement('div');
        thumbnailDescription.classList.add('description');
        // thumbnailDescription.textContent = image.description;

        // ... Agrega más información según sea necesario

        thumbnailContent.appendChild(thumbnailTitle);
        thumbnailContent.appendChild(thumbnailDescription);
        thumbnailItem.appendChild(thumbnailImg);
        thumbnailItem.appendChild(thumbnailContent);
        thumbnailDom.appendChild(thumbnailItem);
    });

    // Resto de tu código...
    //app.js
let nextDom = document.getElementById('next');
let prevDom = document.getElementById('prev');

let carouselDom = document.querySelector('.carousel');
let SliderDom = carouselDom.querySelector('.carousel .list');
let thumbnailBorderDom = document.querySelector('.carousel .thumbnail');
let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
let timeDom = document.querySelector('.carousel .time');

thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
let timeRunning = 3000;
let timeAutoNext = 7000;

nextDom.onclick = function () {
    showSlider('next');
}

prevDom.onclick = function () {
    showSlider('prev');
}
let runTimeOut;
let runNextAuto = setTimeout(() => {
    next.click();
}, timeAutoNext)
function showSlider(type) {
    let SliderItemsDom = SliderDom.querySelectorAll('.carousel .list .item');
    let thumbnailItemsDom = document.querySelectorAll('.carousel .thumbnail .item');

    if (type === 'next') {
        SliderDom.appendChild(SliderItemsDom[0]);
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
        carouselDom.classList.add('next');
    } else {
        SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
        thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
        carouselDom.classList.add('prev');
    }
    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
        carouselDom.classList.remove('next');
        carouselDom.classList.remove('prev');
    }, timeRunning);

    clearTimeout(runNextAuto);
    runNextAuto = setTimeout(() => {
        next.click();
    }, timeAutoNext)
}
});
