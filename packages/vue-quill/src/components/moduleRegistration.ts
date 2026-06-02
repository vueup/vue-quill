const quillRegistrationPathPrefixes = new Set([
  'attributors',
  'blots',
  'formats',
  'modules',
  'themes',
  'ui',
])

const isQuillRegistrationPath = (name: string): boolean => {
  const [prefix] = name.split('/')
  return quillRegistrationPathPrefixes.has(prefix)
}

export const getModuleRegistrationName = (name: string): string => {
  return isQuillRegistrationPath(name) ? name : `modules/${name}`
}

export const getModuleOptionName = (name: string): string | undefined => {
  const registrationName = getModuleRegistrationName(name)
  const modulePrefix = 'modules/'

  return registrationName.startsWith(modulePrefix)
    ? registrationName.slice(modulePrefix.length)
    : undefined
}

type ModuleRegistration = { name: string; module: unknown; options?: object }
type QuillRegistrationTarget = {
  imports?: Record<string, unknown>
  register: (name: string, module: unknown) => void
}
type QuillRegistry = { register: (...definitions: never[]) => unknown }
const globalRegistryPathPrefixes = new Set(['attributors', 'blots', 'formats'])

const usesParchmentRegistry = (name: string): boolean => {
  const [prefix] = name.split('/')
  return globalRegistryPathPrefixes.has(prefix)
}

export const getModuleOptions = (
  modules: ModuleRegistration | ModuleRegistration[],
): { [key: string]: object } | undefined => {
  const modulesOption: { [key: string]: object } = {}
  const registrations = Array.isArray(modules) ? modules : [modules]

  for (const module of registrations) {
    const optionName = getModuleOptionName(module.name)
    if (optionName) modulesOption[optionName] = module.options ?? {}
  }

  return Object.keys(modulesOption).length > 0 ? modulesOption : undefined
}

export const registerModule = (
  Quill: QuillRegistrationTarget,
  module: ModuleRegistration,
  registry?: QuillRegistry,
) => {
  const moduleName = getModuleRegistrationName(module.name)
  const quillImports = Quill.imports
  if (!quillImports || !(moduleName in quillImports)) {
    Quill.register(moduleName, module.module)
  }
  if (registry && usesParchmentRegistry(moduleName)) {
    registry.register(module.module as never)
  }
}
