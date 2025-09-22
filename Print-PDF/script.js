document.getElementById('download').addEventListener('click', () => {
    const cvElement = document.getElementById('page1');

    // Import jsPDF
    const { jsPDF } = window.jspdf;

    // Crear un nuevo jsPDF en formato A4 y orientación vertical
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Función para añadir el contenido HTML al PDF
    pdf.html(cvElement, {
        enableLinks: true,
        callback: function (pdf) {
            // Guardar el PDF
            pdf.save("CV-Carlos-Fernandez.pdf");
        },
        margin: [10, 10, 10, 10], // Márgenes
        autoPaging: 'text',
        x: 0,
        y: 0,
        width: 190, // Ajustar el ancho según sea necesario
        windowWidth: 800 ,// Ancho de la ventan
        html2canvas: {
            useCORS: true
        }
    });
});
