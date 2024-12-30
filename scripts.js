// Specify the URL of the PDF file
const pdfUrl = 'starters.pdf'; // Replace with your actual PDF file path

// Get the container element
const container = document.getElementById('pdf-container');

// Configure PDF.js
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.7.107/pdf.worker.min.js';

let currentScale = 1; // Default scale

// Function to render the PDF
const renderPDF = async (url, scale = 1) => {
    container.innerHTML = ''; // Clear previous content
    const pdf = await pdfjsLib.getDocument(url).promise;

    // Loop through pages and render each as a canvas
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);

        // Dynamically calculate scale based on container width
        const containerWidth = container.clientWidth;
        const viewport = page.getViewport({ scale: (containerWidth / page.getViewport({ scale: 1 }).width) * scale });

        // Create a canvas for each page
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render the PDF page into the canvas
        await page.render({ canvasContext: context, viewport }).promise;

        // Append the canvas to the container
        container.appendChild(canvas);
    }
};

// Function to change the scale of the PDF
function changeScale(factor) {
    currentScale *= factor;
    renderPDF(pdfUrl, currentScale); // Re-render with the new scale
}

// Load the PDF initially
renderPDF(pdfUrl);
