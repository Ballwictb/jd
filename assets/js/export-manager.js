
const exportManager = (() => {
    const domtoimage = window.domtoimage;

    async function downloadPNG() {
        const element = document.getElementById('diffContainer');
        if (!element) return;

        try {
            if (typeof domtoimage === 'undefined') {
                alert('Error: Librería de exportación no disponible');
                return;
            }

            const dataUrl = await domtoimage.toPng(element, {
                quality: 1,
                bgcolor: themeManager.isDark() ? '#404040' : '#fafafa',
                style: {
                    transform: 'scale(2)',
                    transformOrigin: 'top left',
                    width: element.offsetWidth + 'px',
                    height: element.offsetHeight + 'px'
                }
            });

            const link = document.createElement('a');
            link.download = `json-comparison-${new Date().toISOString().slice(0, 10)}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Error generating PNG:', error);
            alert('Error al generar PNG. Por favor intenta de nuevo.');
        }
    }

    function downloadPDF() {
        window.print();
    }

    return {
        downloadPNG,
        downloadPDF
    };
})();
