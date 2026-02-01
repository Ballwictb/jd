
const syntaxHighlighter = (() => {
    function highlight(text) {
        if (!text) {
            return '<span> </span>';
        }

        const pattern = /("(?:[^"\\]|\\.)*")|(\{|\}|\[|\])|(:)|(,)|(\btrue\b|\bfalse\b|\bnull\b)|(-?\d+\.?\d*)/g;

        let result = '';
        let lastIndex = 0;
        let match;

        while ((match = pattern.exec(text)) !== null) {
            if (match.index > lastIndex) {
                result += text.substring(lastIndex, match.index);
            }

            const [fullMatch, str, brace, colon, comma, bool, num] = match;

            if (str) {
                const nextChar = text[match.index + fullMatch.length];
                const isKey = nextChar === ':';
                const colorClass = isKey ?
                    'text-purple-600 dark:text-purple-400' :
                    'text-green-600 dark:text-green-400';
                result += `<span class="${colorClass}">${fullMatch}</span>`;
            } else if (brace) {
                result += `<span class="text-blue-700 dark:text-blue-300 font-bold">${fullMatch}</span>`;
            } else if (colon || comma) {
                result += `<span class="text-gray-600 dark:text-gray-400">${fullMatch}</span>`;
            } else if (bool) {
                result += `<span class="text-cyan-600 dark:text-cyan-400">${fullMatch}</span>`;
            } else if (num) {
                result += `<span class="text-orange-600 dark:text-orange-400">${fullMatch}</span>`;
            }

            lastIndex = match.index + fullMatch.length;
        }

        if (lastIndex < text.length) {
            result += text.substring(lastIndex);
        }

        return result;
    }

    return {
        highlight
    };
})();
