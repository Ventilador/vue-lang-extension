export function parse(text: string) {
    return parseContent(text);
}


const startTag = '<script lang="ts">';
const endTag = '</script>';
function parseContent(originalContent: string) {
    const start = originalContent.indexOf(startTag);
    if (start !== -1) {
        const end = originalContent.indexOf(endTag, start);
        if (end !== -1) {
            const parsed = originalContent.slice(start + startTag.length, end);
            return { start: start + startTag.length, end, originalContent, parsed };
        }
    }

    return {
        start: -1,
        end: -1,
        parsed: empty,
        originalContent: originalContent
    };
}


const empty = `import Vue from 'vue';
export default Vue.extend({});
`