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
                            Comparación de Json
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
        <div id="editorView">
            <div class="grid gap-6 lg:grid-cols-2">
                <!-- Editor Izquierdo -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-semibold">JSON 1</h2>
                        <div class="flex gap-2">
                            <button
                                onclick="jsonFormatter.format('left')"
                                class="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                            >
                                <i data-lucide="wand-2" class="h-4 w-4"></i>
                                Formatear
                            </button>
                            <button
                                onclick="jsonFormatter.minify('left')"
                                class="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                            >
                                <i data-lucide="minimize-2" class="h-4 w-4"></i>
                                Minificar
                            </button>
                            <button
                                onclick="uiManager.copyJson('left', event)"
                                class="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150"
                            >
                                <i data-lucide="copy" class="h-4 w-4"></i>
                            </button>
                            <button
                                onclick="uiManager.clearJson('left', event)"
                                class="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150"
                            >
                                <i data-lucide="trash-2" class="h-4 w-4"></i>
                            </button>
                        </div>
                    </div>

                    <div class="relative">
                        <textarea
                            id="leftJson"
                            placeholder='{"name": "valor", "datos": [1, 2, 3]}'
                            class="w-full h-[500px] p-4 font-mono text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 overflow-auto"
                            spellcheck="false"
                        ></textarea>
                        <div id="leftError" class="hidden absolute bottom-2 left-2 right-2 rounded-md bg-red-100 dark:bg-red-950/40 px-3 py-2 z-10">
                            <p class="text-xs text-red-700 dark:text-red-400"></p>
                        </div>
                        <div id="leftValid" class="hidden absolute bottom-2 right-2 rounded-md bg-green-100 dark:bg-green-950/40 px-2 py-1 z-10">
                            <p class="text-xs font-medium text-green-700 dark:text-green-400">✓ JSON Válido</p>
                        </div>
                    </div>

                </div>

                <!-- Editor Derecho -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-semibold">JSON 2</h2>
                        <div class="flex gap-2">
                            <button
                                onclick="jsonFormatter.format('right')"
                                class="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                            >
                                <i data-lucide="wand-2" class="h-4 w-4"></i>
                                Formatear
                            </button>
                            <button
                                onclick="jsonFormatter.minify('right')"
                                class="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                            >
                                <i data-lucide="minimize-2" class="h-4 w-4"></i>
                                Minificar
                            </button>
                            <button
                                onclick="uiManager.copyJson('right', event)"
                                class="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150"
                            >
                                <i data-lucide="copy" class="h-4 w-4"></i>
                            </button>
                            <button
                                onclick="uiManager.clearJson('right', event)"
                                class="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150"
                            >
                                <i data-lucide="trash-2" class="h-4 w-4"></i>
                            </button>
                        </div>
                    </div>

                    <div class="relative">
                        <textarea
                            id="rightJson"
                            placeholder='{"name": "valor", "datos": [1, 2, 3]}'
                            class="w-full h-[500px] p-4 font-mono text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 overflow-auto"
                            spellcheck="false"
                        ></textarea>
                        <div id="rightError" class="hidden absolute bottom-2 left-2 right-2 rounded-md bg-red-100 dark:bg-red-950/40 px-3 py-2 z-10">
                            <p class="text-xs text-red-700 dark:text-red-400"></p>
                        </div>
                        <div id="rightValid" class="hidden absolute bottom-2 right-2 rounded-md bg-green-100 dark:bg-green-950/40 px-2 py-1 z-10">
                            <p class="text-xs font-medium text-green-700 dark:text-green-400">✓ JSON Válido</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Botones de acción central -->
            <div class="mt-6 flex justify-center gap-4">
                <button
                    onclick="uiManager.loadExample()"
                    class="rounded-md border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                    <i data-lucide="file-text" class="h-4 w-4"></i>
                    Cargar Ejemplos
                </button>
                <button
                    id="compareBtn"
                    onclick="app.compareJsons()"
                    disabled
                    class="rounded-lg bg-gray-900 dark:bg-gray-50 px-8 py-3 text-gray-50 dark:text-gray-900 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <i data-lucide="file-json" class="h-5 w-5"></i>
                    Comparar JSONs
                </button>
            </div>
        </div>
    </div>
    
    <script src="assets/js/app.js"></script>
    <script src="assets/js/ui-manager.js"></script>


    <script>
        document.addEventListener('DOMContentLoaded',()=>{
            app.init();
            lucide.createIcons();
        });
    </script>
</body>
</html>