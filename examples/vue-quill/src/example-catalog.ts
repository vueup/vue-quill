export type ExampleSectionId =
  | 'basic'
  | 'model'
  | 'toolbars'
  | 'modules'
  | 'themes'
  | 'read-only'
  | 'events'
  | 'real-world'

export type ThemeValue = 'snow' | 'bubble' | ''

export type ToolbarValue = string | unknown[] | false

export type ExampleSection = {
  id: ExampleSectionId
  title: string
  description: string
  coverage: string[]
}

export type ToolbarExample = {
  id: 'minimal' | 'array' | 'custom-container' | 'disabled'
  label: string
  description: string
  toolbar: ToolbarValue
}

export type ThemeExample = {
  value: ThemeValue
  label: string
  description: string
}

export const requiredCoverage = [
  'basic usage',
  'configuration variations',
  'toolbar customization',
  'custom modules',
  'v-model:content',
  'read-only mode',
  'placeholder usage',
  'theme variations',
  'content initialization',
  'event handling',
  'methods and refs',
  'form integration',
]

export const exampleSections: ExampleSection[] = [
  {
    id: 'basic',
    title: 'Basic editor',
    description:
      'A minimal Snow editor with placeholder text and initialized Delta content.',
    coverage: ['basic usage', 'placeholder usage', 'content initialization'],
  },
  {
    id: 'model',
    title: 'v-model and content types',
    description:
      'Two-way HTML content binding with a live preview and editor ref methods.',
    coverage: ['v-model:content', 'methods and refs'],
  },
  {
    id: 'toolbars',
    title: 'Toolbar customization',
    description:
      'Switch between a built-in preset, an inline toolbar array, a custom slot toolbar, and no toolbar.',
    coverage: ['configuration variations', 'toolbar customization'],
  },
  {
    id: 'modules',
    title: 'Modules',
    description:
      'Register a custom Quill module through the modules prop and pass per-instance options.',
    coverage: ['custom modules', 'configuration variations'],
  },
  {
    id: 'themes',
    title: 'Themes',
    description:
      'Compare Snow, Bubble, and the unthemed core editor while importing the matching CSS.',
    coverage: ['theme variations'],
  },
  {
    id: 'read-only',
    title: 'Read-only and enable states',
    description:
      'Show a locked knowledge-base article and a live enable toggle for user input.',
    coverage: ['read-only mode'],
  },
  {
    id: 'events',
    title: 'Events',
    description:
      'Capture ready, focus, blur, text-change, selection-change, and editor-change payloads.',
    coverage: ['event handling'],
  },
  {
    id: 'real-world',
    title: 'Form integration',
    description:
      'Bind editor HTML into a form-like workflow with validation and submission state.',
    coverage: ['form integration'],
  },
]

export const toolbarExamples: ToolbarExample[] = [
  {
    id: 'minimal',
    label: 'Preset: minimal',
    description: 'Uses the built-in minimal toolbar preset.',
    toolbar: 'minimal',
  },
  {
    id: 'array',
    label: 'Inline array',
    description: 'Passes an array directly to the toolbar prop.',
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ header: [2, 3, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'blockquote', 'clean'],
    ],
  },
  {
    id: 'custom-container',
    label: 'Custom container',
    description: 'Provides toolbar markup through the toolbar slot.',
    toolbar: '#article-toolbar',
  },
  {
    id: 'disabled',
    label: 'No toolbar',
    description: 'Passes false to disable the toolbar module.',
    toolbar: false,
  },
]

export const themeExamples: ThemeExample[] = [
  {
    value: 'snow',
    label: 'Snow',
    description:
      'The default full editor chrome for forms and publishing tools.',
  },
  {
    value: 'bubble',
    label: 'Bubble',
    description:
      'A lighter writing surface with contextual formatting controls.',
  },
  {
    value: '',
    label: 'Core',
    description:
      'No named theme, useful when you want to own the surrounding UI.',
  },
]
