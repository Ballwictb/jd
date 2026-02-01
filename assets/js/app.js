const app = (() => {
    let differences = [];

    let leftJsonEl, rightJsonEl, leftErrorEl, rightErrorEl;
    let leftValidEl, rightValidEl;
    let editorView, diffView, diffContainer, diffSummary;
    let downloadPngBtn, downloadPdfBtn;

    function init() {
        leftJsonEl = document.getElementById('leftJson');
        rightJsonEl = document.getElementById('rightJson');
        leftErrorEl = document.getElementById('leftError');
        rightErrorEl = document.getElementById('rightError');
        leftValidEl = document.getElementById('leftValid');
        rightValidEl = document.getElementById('rightValid');
        editorView = document.getElementById('editorView');
        diffView = document.getElementById('diffView');
        diffContainer = document.getElementById('diffContainer');
        diffSummary = document.getElementById('diffSummary');
        downloadPngBtn = document.getElementById('downloadPngBtn');
        downloadPdfBtn = document.getElementById('downloadPdfBtn');

        leftJsonEl.addEventListener('input', () => validateAndUpdate('left'));
        rightJsonEl.addEventListener('input', () => validateAndUpdate('right'));

        document.getElementById('darkModeToggle').addEventListener('click', () => {
            themeManager.toggle();
        });

        themeManager.init();

        validateAndUpdate('left');
        validateAndUpdate('right');
    }

    function validateAndUpdate(side) {
        const textarea = side === 'left' ? leftJsonEl : rightJsonEl;
        const errorEl = side === 'left' ? leftErrorEl : rightErrorEl;
        const validEl = side === 'left' ? leftValidEl : rightValidEl;

        jsonValidator.updateUI(side, textarea, errorEl, validEl);

        updateCompareButton();
    }

    function updateCompareButton() {
        const leftValidation = jsonValidator.validate(leftJsonEl.value);
        const rightValidation = jsonValidator.validate(rightJsonEl.value);

        const canCompare = leftValidation.valid && rightValidation.valid &&
            leftJsonEl.value.trim() && rightJsonEl.value.trim();

        uiManager.updateCompareButton(canCompare);
    }

    function compareJsons() {
        const leftValidation = jsonValidator.validate(leftJsonEl.value);
        const rightValidation = jsonValidator.validate(rightJsonEl.value);

        if (!leftValidation.valid || !rightValidation.valid) {
            return;
        }

        const comparisonResult = jsonComparator.compare(
            leftValidation.parsed,
            rightValidation.parsed
        );

        const diffSummary = jsonComparator.generateSummary(comparisonResult);
        differences = diffSummary;

        const leftFormatted = JSON.stringify(leftValidation.parsed, null, 2);
        const rightFormatted = JSON.stringify(rightValidation.parsed, null, 2);

        const leftLines = leftFormatted.split('\n');
        const rightLines = rightFormatted.split('\n');

        const leftPathMap = jsonComparator.buildLinePathMap(leftLines);
        const rightPathMap = jsonComparator.buildLinePathMap(rightLines);

        const addedPaths = comparisonResult.added;
        const removedPaths = comparisonResult.removed;
        const modifiedPaths = comparisonResult.modified;

        renderDiffView(
            leftLines, rightLines,
            leftPathMap, rightPathMap,
            addedPaths, removedPaths, modifiedPaths
        );

        editorView.classList.add('hidden');
        diffView.classList.remove('hidden');

        diffSummary.textContent = differences.length === 0
            ? 'Los JSON son idénticos'
            : `Se encontraron ${differences.length} diferencia${differences.length !== 1 ? 's' : ''}`;

        if (differences.length > 0) {
            downloadPngBtn.classList.remove('hidden');
            downloadPdfBtn.classList.remove('hidden');
        }

        lucide.createIcons();
    }

    function renderDiffView(leftLines, rightLines, leftPathMap, rightPathMap,
        addedPaths, removedPaths, modifiedPaths) {
        let html = '';

        if (differences.length > 0) {
            html += renderChangeSummary();
        }

        html += renderLineByLineComparison(
            leftLines, rightLines,
            leftPathMap, rightPathMap,
            addedPaths, removedPaths, modifiedPaths
        );

        diffContainer.innerHTML = html;
    }

    function renderChangeSummary() {
        let html = `
            <div class="overflow-hidden rounded-lg border border-border bg-card">
                <div class="border-b border-border bg-secondary px-4 py-3">
                    <h3 class="text-sm font-semibold">Resumen de Cambios</h3>
                </div>
                <div class="p-4">
                    <div class="space-y-2 max-h-64 overflow-auto">
        `;

        differences.forEach(diff => {
            const typeClass = diff.type === 'added' ? 'text-green-700 dark:text-green-400' :
                diff.type === 'removed' ? 'text-red-700 dark:text-red-400' :
                    'text-amber-700 dark:text-amber-400';
            const typeIcon = diff.type === 'added' ? '+' :
                diff.type === 'removed' ? '-' : '~';

            html += `
                <div class="text-sm font-mono ${typeClass}">
                    <span class="font-bold">${typeIcon}</span> ${diff.path}
            `;

            if (diff.type === 'modified') {
                html += `<br><span class="ml-4 text-xs text-muted-foreground">
                    ${JSON.stringify(diff.oldValue)} → ${JSON.stringify(diff.newValue)}
                </span>`;
            } else if (diff.type === 'added') {
                html += `<br><span class="ml-4 text-xs text-muted-foreground">
                    + ${JSON.stringify(diff.value)}
                </span>`;
            } else {
                html += `<br><span class="ml-4 text-xs text-muted-foreground">
                    - ${JSON.stringify(diff.value)}
                </span>`;
            }

            html += '</div>';
        });

        html += `
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    function renderLineByLineComparison(leftLines, rightLines, leftPathMap, rightPathMap,
        addedPaths, removedPaths, modifiedPaths) {
        let html = `
            <div class="overflow-hidden rounded-lg border border-border bg-card">
                <div class="border-b border-border bg-secondary px-4 py-3">
                    <h3 class="text-sm font-semibold">Comparación Línea por Línea</h3>
                </div>
                <div class="grid grid-cols-2 divide-x divide-border overflow-x-auto">
                    <div class="overflow-auto max-h-[600px]">
                        <div class="bg-secondary border-b border-border px-3 py-2">
                            <p class="text-xs font-semibold">JSON 1</p>
                        </div>
        `;

        const maxLines = Math.max(leftLines.length, rightLines.length);
        for (let i = 0; i < maxLines; i++) {
            const leftLine = i < leftLines.length ? leftLines[i] : '';
            const leftPath = leftPathMap.get(i);

            let type = 'equal';
            if (!jsonComparator.isStructural(leftLine.trim())) {
                if (leftPath && removedPaths.has(leftPath)) type = 'removed';
                else if (leftPath && modifiedPaths.has(leftPath)) type = 'modified';
            }

            html += renderDiffLine(leftLine, i + 1, type, 'left');
        }

        html += `
                    </div>
                    <div class="overflow-auto max-h-[600px]">
                        <div class="bg-secondary border-b border-border px-3 py-2">
                            <p class="text-xs font-semibold">JSON 2</p>
                        </div>
        `;

        for (let i = 0; i < maxLines; i++) {
            const rightLine = i < rightLines.length ? rightLines[i] : '';
            const rightPath = rightPathMap.get(i);

            let type = 'equal';
            if (!jsonComparator.isStructural(rightLine.trim())) {
                if (rightPath && addedPaths.has(rightPath)) type = 'added';
                else if (rightPath && modifiedPaths.has(rightPath)) type = 'modified';
            }

            html += renderDiffLine(rightLine, i + 1, type, 'right');
        }

        html += `
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    function renderDiffLine(line, lineNum, type, side) {
        const bgClass = type === 'added' ? 'bg-green-100 dark:bg-green-950/40 border-l-4 border-l-green-500' :
            type === 'removed' ? 'bg-red-100 dark:bg-red-950/40 border-l-4 border-l-red-500' :
                type === 'modified' ? 'bg-amber-100 dark:bg-amber-950/40 border-l-4 border-l-amber-500' :
                    '';

        const numBg = type === 'added' ? 'bg-green-200 dark:bg-green-900/50 text-green-700 dark:text-green-400 font-semibold' :
            type === 'removed' ? 'bg-red-200 dark:bg-red-900/50 text-red-700 dark:text-red-400 font-semibold' :
                type === 'modified' ? 'bg-amber-200 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 font-semibold' :
                    'bg-secondary';

        const icon = type === 'added' ? '<i data-lucide="plus" class="h-4 w-4 text-green-600 dark:text-green-400"></i>' :
            type === 'removed' ? '<i data-lucide="minus" class="h-4 w-4 text-red-600 dark:text-red-400"></i>' :
                type === 'modified' ? '<i data-lucide="arrow-left-right" class="h-4 w-4 text-amber-600 dark:text-amber-400"></i>' : '';

        return `
            <div class="flex border-b border-border ${bgClass}">
                <div class="w-12 flex-shrink-0 px-2 py-1 text-right text-xs text-muted-foreground border-r border-border ${numBg}">
                    ${line ? lineNum : ''}
                </div>
                <div class="flex-1 px-3 py-1 overflow-x-auto flex items-center gap-2">
                    ${icon}
                    <pre class="m-0 text-sm font-mono">${syntaxHighlighter.highlight(line || ' ')}</pre>
                </div>
            </div>
        `;
    }

    function backToEditor() {
        diffView.classList.add('hidden');
        editorView.classList.remove('hidden');

        downloadPngBtn.classList.add('hidden');
        downloadPdfBtn.classList.add('hidden');
    }

    return {
        init,
        compareJsons,
        backToEditor
    };
})();
