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
