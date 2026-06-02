import type QuillConstructorType from 'quill'

export type QuillConstructor = typeof QuillConstructorType

let loadedQuill: QuillConstructor | undefined
let quillLoadPromise: Promise<QuillConstructor> | undefined
let pendingRegistrations: unknown[][] = []

const isBrowser = () => typeof document !== 'undefined'

const replayPendingRegistrations = (Quill: QuillConstructor) => {
  const registrations = pendingRegistrations
  pendingRegistrations = []

  for (const args of registrations) {
    ;(Quill.register as (...registrationArgs: unknown[]) => void)(...args)
  }
}

export const loadQuill = async (): Promise<QuillConstructor> => {
  if (loadedQuill) return loadedQuill

  if (!isBrowser()) {
    throw new Error(
      '@vueup/vue-quill: Quill can only be loaded in a browser environment.',
    )
  }

  quillLoadPromise ??= import('quill').then(({ default: Quill }) => {
    loadedQuill = Quill
    replayPendingRegistrations(Quill)
    return Quill
  })

  return quillLoadPromise
}

export const getLoadedQuill = (): QuillConstructor | undefined => loadedQuill

const getQuillOrThrow = (): QuillConstructor => {
  if (loadedQuill) return loadedQuill

  throw new Error(
    '@vueup/vue-quill: Quill is not loaded yet. Use loadQuill() in a browser-only lifecycle hook, or access the Quill instance from the ready event.',
  )
}

export const Quill = new Proxy(function QuillProxy() {}, {
  get(_target, property) {
    if (property === 'register') {
      return (...args: unknown[]) => {
        if (loadedQuill) {
          return (loadedQuill.register as (...registerArgs: unknown[]) => void)(
            ...args,
          )
        }

        pendingRegistrations.push(args)
        if (isBrowser()) void loadQuill()
      }
    }

    const Quill = getQuillOrThrow()
    const value = Quill[property as keyof QuillConstructor]

    return typeof value === 'function' ? value.bind(Quill) : value
  },
  construct(_target, args) {
    const Quill = getQuillOrThrow() as unknown as new (
      ...constructorArgs: unknown[]
    ) => object

    return new Quill(...args)
  },
}) as unknown as QuillConstructor
