
const themeManager = (() => {
    let darkMode = false;

    function init() {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        if (savedDarkMode) {
            darkMode = true;
            document.documentElement.classList.add('dark');
        }
    }

    function toggle() {
        darkMode = !darkMode;
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', darkMode.toString());

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function isDark() {
        return darkMode;
    }

    return {
        init,
        toggle,
        isDark
    };
})();
