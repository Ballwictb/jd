<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JSON Compare</title>
    <link rel="shortcut icon" href="assets/logo.webp" type="image/x-icon">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/deep-diff@1.0.2/dist/deep-diff.min.js"></script>
    <script>
        tailwind.config = {
            darkMode: 'class'
        }
    </script>
</head>
<body class="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 transition-colors duration-200">
    <div class="container mx-auto p-6 max-w-7xl">
        <header class="mb-8">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <img src="assets/logo.webp" alt="logo json" class="h-12 w-12">
                    <div>
                        <h1 class="text-2xl font-bold">JSON DIFF</h1>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            JSON Comparison
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button
                        id="darkModeToggle"
                        class="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <i data-lucide="sun" class="h-5 w-5 dark:hidden"></i>
                        <i data-lucide="moon" class="h-5 w-5 hidden dark:block"></i>
                    </button>
                    <a
                        href="https://github.com/ballwictb"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors inline-flex items-center justify-center"
                    >
                        <i data-lucide="github" class="h-5 w-5"></i>
                    </a>
                </div>
            </div>
        </header>
    </div>
    
    <script src="assets/js/app.js"></script>


    <script>
        document.addEventListener('DOMContentLoaded',()=>{
            app.init();
            lucide.createIcons();
        });
    </script>
</body>
</html>