export interface PresetContent {
  id: string
  label: string
  icon: string
  delta: { ops: any[] }
}

export const presets: PresetContent[] = [
  {
    id: 'welcome',
    label: 'Welcome',
    icon: '👋',
    delta: {
      ops: [
        { insert: 'Welcome to VueQuill!' },
        { attributes: { header: 1 }, insert: '\n' },
        { insert: '\nThis is a ' },
        { attributes: { bold: true }, insert: 'rich text editor' },
        { insert: ' built for Vue 3. Try editing this content or explore the options below.\n\n' },
        { insert: '✨ ' },
        { attributes: { italic: true }, insert: 'Tip: ' },
        { insert: 'Switch themes and toolbar options to see different configurations.\n' },
      ],
    },
  },
  {
    id: 'article',
    label: 'Article',
    icon: '📄',
    delta: {
      ops: [
        { insert: 'How to Build a Rich Text Editor' },
        { attributes: { header: 1 }, insert: '\n' },
        { insert: '\nRich text editors are essential for modern web applications. They allow users to create formatted content without knowing HTML.\n\n' },
        { insert: 'Key Features' },
        { attributes: { header: 2 }, insert: '\n' },
        { insert: 'Bold and italic text formatting' },
        { attributes: { list: 'bullet' }, insert: '\n' },
        { insert: 'Multiple heading levels' },
        { attributes: { list: 'bullet' }, insert: '\n' },
        { insert: 'Lists and blockquotes' },
        { attributes: { list: 'bullet' }, insert: '\n' },
        { insert: 'Code blocks and inline code' },
        { attributes: { list: 'bullet' }, insert: '\n' },
        { insert: '\n' },
        { attributes: { blockquote: true }, insert: '"The best interface is no interface." — Golden Krishna\n' },
      ],
    },
  },
  {
    id: 'code',
    label: 'Code',
    icon: '💻',
    delta: {
      ops: [
        { insert: 'Code Example' },
        { attributes: { header: 1 }, insert: '\n' },
        { insert: '\nHere\'s how to use VueQuill in your project:\n\n' },
        { attributes: { 'code-block': 'javascript' }, insert: 'import { QuillEditor } from \'@vueup/vue-quill\'\nimport \'@vueup/vue-quill/dist/vue-quill.snow.css\'\n' },
        { insert: '\nThen use it in your template:\n\n' },
        { attributes: { 'code-block': 'vue' }, insert: '<QuillEditor v-model:content="content" theme="snow" />\n' },
        { insert: '\nThat\'s it! You now have a fully functional editor.\n' },
      ],
    },
  },
  {
    id: 'empty',
    label: 'Empty',
    icon: '📝',
    delta: {
      ops: [{ insert: '\n' }],
    },
  },
]

export function getPresetById(id: string): PresetContent | undefined {
  return presets.find((p) => p.id === id)
}
