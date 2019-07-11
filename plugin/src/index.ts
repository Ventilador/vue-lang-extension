import ConfigPlugin from '@ts-extras/plugin';
export = ConfigPlugin({
    extension: '.vue',
    parse: function (_from, content) {
        const result = parseContent(content);
        return {
            oldText: result.originalContent,
            newText: result.parsed,
            span: {
                start: result.start,
                length: result.end - result.start
            }
        }
    }
});

const startTag = '<script lang="ts">';
const endTag = '</script>';
function parseContent(originalContent: string) {
    const start = originalContent.indexOf(startTag);
    if (start !== -1) {
        const end = originalContent.indexOf(endTag, start);
        if (end !== -1) {
            const parsed = originalContent.slice(start + startTag.length, end);
            return { start: start + startTag.length, end: end + endTag.length, originalContent, parsed };
        }
    }

    return {
        start: originalContent.length,
        end: originalContent.length,
        parsed: emptyParser,
        originalContent: originalContent
    };
}

const emptyParser = `import Vue from 'vue';
export default Vue.extend({});
`
