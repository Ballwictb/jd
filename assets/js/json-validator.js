
const jsonValidator = (() => {
    function validate(text) {
        if (!text.trim()) {
            return { valid: true, parsed: null, error: '' };
        }

        try {
            const parsed = JSON.parse(text);
            return { valid: true, parsed, error: '' };
        } catch (e) {
            return { valid: false, parsed: null, error: e.message };
        }
    }

    function updateUI(side, textarea, errorEl, validEl) {
        const validation = validate(textarea.value);

        if (validation.error) {
            errorEl.querySelector('p').textContent = validation.error;
            errorEl.classList.remove('hidden');
            validEl.classList.add('hidden');
        } else {
            errorEl.classList.add('hidden');

            if (textarea.value.trim()) {
                validEl.classList.remove('hidden');
            } else {
                validEl.classList.add('hidden');
            }
        }

        return validation;
    }

    return {
        validate,
        updateUI
    };
})();
