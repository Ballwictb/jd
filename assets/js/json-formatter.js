
const jsonFormatter = (() => {
    function format(side) {
        const textarea = document.getElementById(side === 'left' ? 'leftJson' : 'rightJson');
        const text = textarea.value;

        if (!text.trim()) {
            return;
        }

        try {
            const parsed = JSON.parse(text);
            const formatted = JSON.stringify(parsed, null, 2);
            textarea.value = formatted;

            textarea.dispatchEvent(new Event('input'));
        } catch (e) {
            alert('Error al formatear: ' + e.message);
        }
    }

    function minify(side) {
        const textarea = document.getElementById(side === 'left' ? 'leftJson' : 'rightJson');
        const text = textarea.value;

        if (!text.trim()) {
            return;
        }

        try {
            const parsed = JSON.parse(text);
            const minified = JSON.stringify(parsed);
            textarea.value = minified;

            textarea.dispatchEvent(new Event('input'));
        } catch (e) {
            alert('Error al minificar: ' + e.message);
        }
    }

    return {
        format,
        minify
    };
})();
