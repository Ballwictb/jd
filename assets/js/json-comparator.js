
const jsonComparator = (function () {
    'use strict';

    const DeepDiff = window.DeepDiff || window.diff;
    function compare(leftObj, rightObj) {
        const differences = DeepDiff.diff(leftObj, rightObj) || [];

        const result = {
            added: new Set(),
            removed: new Set(),
            modified: new Set(),
            all: []
        };

        differences.forEach(diff => {
            const path = buildPath(diff.path);

            switch (diff.kind) {
                case 'N':
                    result.added.add(path);
                    result.all.push({
                        type: 'added',
                        path: path,
                        value: diff.rhs
                    });
                    break;

                case 'D':
                    result.removed.add(path);
                    result.all.push({
                        type: 'removed',
                        path: path,
                        value: diff.lhs
                    });
                    break;

                case 'E':
                    result.modified.add(path);
                    result.all.push({
                        type: 'modified',
                        path: path,
                        oldValue: diff.lhs,
                        newValue: diff.rhs
                    });
                    break;

                case 'A':
                    handleArrayChange(diff, path, result);
                    break;
            }
        });

        return result;
    }

    function buildPath(pathArray) {
        if (!pathArray || pathArray.length === 0) return '';

        return pathArray.reduce((acc, key, index) => {
            if (typeof key === 'number') {
                return `${acc}[${key}]`;
            }
            return index === 0 ? key : `${acc}.${key}`;
        }, '');
    }

    function handleArrayChange(diff, basePath, result) {
        const itemPath = `${basePath}[${diff.index}]`;

        if (diff.item) {
            switch (diff.item.kind) {
                case 'N':
                    result.added.add(itemPath);
                    result.all.push({
                        type: 'added',
                        path: itemPath,
                        value: diff.item.rhs
                    });
                    break;

                case 'D':
                    result.removed.add(itemPath);
                    result.all.push({
                        type: 'removed',
                        path: itemPath,
                        value: diff.item.lhs
                    });
                    break;

                case 'E':
                    result.modified.add(itemPath);
                    result.all.push({
                        type: 'modified',
                        path: itemPath,
                        oldValue: diff.item.lhs,
                        newValue: diff.item.rhs
                    });
                    break;
            }
        }
    }

    function generateSummary(result) {
        return result.all.map(diff => {
            const summary = {
                path: diff.path,
                type: diff.type,
                description: formatDiff(diff)
            };

            if (diff.type === 'modified') {
                summary.oldValue = diff.oldValue;
                summary.newValue = diff.newValue;
            } else {
                summary.value = diff.value;
            }

            return summary;
        });
    }

    function formatDiff(diff) {
        const formatValue = (v) => {
            if (v === null) return 'null';
            if (v === undefined) return 'undefined';
            if (typeof v === 'string') return `"${v}"`;
            if (typeof v === 'object') return JSON.stringify(v);
            return String(v);
        };

        if (diff.type === 'added') {
            return `Añadido: ${formatValue(diff.value)}`;
        } else if (diff.type === 'removed') {
            return `Eliminado: ${formatValue(diff.value)}`;
        } else {
            return `${formatValue(diff.oldValue)} → ${formatValue(diff.newValue)}`;
        }
    }

    function buildLinePathMap(lines) {
        const lineToPath = new Map();
        const pathStack = [];
        let arrayIndexStack = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            const keyMatch = line.match(/"([^"]+)"\s*:/);
            if (keyMatch) {
                const key = keyMatch[1];
                const currentPath = pathStack.length > 0
                    ? `${pathStack.join('.')}.${key}`
                    : key;

                lineToPath.set(i, currentPath);

                if (trimmed.endsWith('{')) {
                    pathStack.push(key);
                } else if (trimmed.endsWith('[')) {
                    pathStack.push(key);
                    arrayIndexStack.push(0);
                }
            }
            else if (trimmed &&
                !isStructural(trimmed) &&
                pathStack.length > 0) {

                const arrayIndex = arrayIndexStack.length > 0
                    ? arrayIndexStack[arrayIndexStack.length - 1]
                    : 0;

                const currentPath = `${pathStack.join('.')}[${arrayIndex}]`;
                lineToPath.set(i, currentPath);

                if (arrayIndexStack.length > 0) {
                    arrayIndexStack[arrayIndexStack.length - 1]++;
                }
            }

            if (trimmed === '}' || trimmed === '},') {
                pathStack.pop();
            }
            if (trimmed === ']' || trimmed === '],') {
                pathStack.pop();
                arrayIndexStack.pop();
            }
        }

        return lineToPath;
    }

    function isStructural(line) {
        return line === '{' || line === '}' || line === '},' ||
            line === '[' || line === ']' || line === '],' ||
            line === '' || line === ',';
    }

    return {
        compare,
        generateSummary,
        buildLinePathMap,
        isStructural
    };
})();
