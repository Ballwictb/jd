
const uiManager = (() => {
    const EXAMPLE_JSON_1 = {
        "name": "Jamal Rabah",
        "age": 21,
        "email": "jamal@example.com",
        "address": {
            "city": "Madrid",
            "country": "España"
        },
        "hobbies": [
            "lectura",
            "deportes"
        ],
        "active": true
    };

    const EXAMPLE_JSON_2 = {
        "name": "Jamal",
        "age": 20,
        "email": "jamal.rabah@example.com",
        "address": {
            "city": "Barcelona",
            "country": "España",
            "zipCode": "08001"
        },
        "hobbies": [
            "lectura",
            "música",
            "deportes"
        ],
        "active": true,
        "premium": true
    };

    function animateButton(event) {
        const button = event.currentTarget;
        button.classList.add('scale-95');
        setTimeout(() => {
            button.classList.remove('scale-95');
        }, 150);
    }

    function copyJson(side, event) {
        if (event) animateButton(event);

        const textarea = document.getElementById(side === 'left' ? 'leftJson' : 'rightJson');

        navigator.clipboard.writeText(textarea.value).then(() => {
            showNotification('JSON copiado al portapapeles');
        }).catch(err => {
            alert('Error al copiar: ' + err.message);
        });
    }

    function clearJson(side, event) {
        if (event) animateButton(event);

        const textarea = document.getElementById(side === 'left' ? 'leftJson' : 'rightJson');
        textarea.value = '';

        textarea.dispatchEvent(new Event('input'));
    }

    function loadExample() {

        const leftTextarea = document.getElementById('leftJson');
        const rightTextarea = document.getElementById('rightJson');

        const leftJson = JSON.stringify(EXAMPLE_JSON_1, null, 2);
        const rightJson = JSON.stringify(EXAMPLE_JSON_2, null, 2);

        leftTextarea.value = leftJson;
        rightTextarea.value = rightJson;

        leftTextarea.dispatchEvent(new Event('input'));
        rightTextarea.dispatchEvent(new Event('input'));

        showNotification('Ejemplos cargados correctamente');
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300';
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    function updateCompareButton(enabled) {
        const compareBtn = document.getElementById('compareBtn');
        compareBtn.disabled = !enabled;
    }

    return {
        copyJson,
        clearJson,
        loadExample,
        showNotification,
        updateCompareButton
    };
})();
