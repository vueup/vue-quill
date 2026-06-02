export const getModuleRegistrationName = (name: string): string => {
  return name.includes('/') ? name : `modules/${name}`
}

export const getModuleOptionName = (name: string): string | undefined => {
  const registrationName = getModuleRegistrationName(name)
  const modulePrefix = 'modules/'

  return registrationName.startsWith(modulePrefix)
    ? registrationName.slice(modulePrefix.length)
    : undefined
}

type ModuleRegistration = { name: string; options?: object }

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
