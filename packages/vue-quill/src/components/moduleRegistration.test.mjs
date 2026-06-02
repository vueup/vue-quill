import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  getModuleOptions,
  getModuleOptionName,
  getModuleRegistrationName,
  registerModule,
} from './moduleRegistration.ts'

describe('module registration names', () => {
  it('keeps full Quill registration paths intact', () => {
    assert.equal(getModuleRegistrationName('mention'), 'modules/mention')
    assert.equal(
      getModuleRegistrationName('modules/mention'),
      'modules/mention',
    )
    assert.equal(getModuleRegistrationName('blots/mention'), 'blots/mention')
    assert.equal(
      getModuleRegistrationName('formats/mention'),
      'formats/mention',
    )
    assert.equal(
      getModuleRegistrationName('attributors/class/mention'),
      'attributors/class/mention',
    )
    assert.equal(getModuleRegistrationName('themes/custom'), 'themes/custom')
    assert.equal(getModuleRegistrationName('ui/icons'), 'ui/icons')
  })

  it('only adds Quill module registrations to options.modules', () => {
    assert.equal(getModuleOptionName('mention'), 'mention')
    assert.equal(getModuleOptionName('modules/mention'), 'mention')
    assert.equal(getModuleOptionName('blots/mention'), undefined)
  })

  it('keeps slash-containing shorthand names as modules', () => {
    const options = { source: () => [] }

    assert.equal(
      getModuleRegistrationName('@scope/mention'),
      'modules/@scope/mention',
    )
    assert.equal(getModuleOptionName('@scope/mention'), '@scope/mention')
    assert.deepEqual(
      getModuleOptions({
        name: '@scope/mention',
        module: {},
        options,
      }),
      {
        '@scope/mention': options,
      },
    )
  })

  it('does not create an empty modules option for non-module registrations', () => {
    assert.equal(
      getModuleOptions({
        name: 'blots/mention',
        module: {},
      }),
      undefined,
    )
  })

  it('composes options only for module registrations', () => {
    const mentionOptions = { allowedChars: /^[A-Za-z\\s]*$/ }

    assert.deepEqual(
      getModuleOptions([
        {
          name: 'blots/mention',
          module: {},
        },
        {
          name: 'modules/mention',
          module: {},
          options: mentionOptions,
        },
      ]),
      {
        mention: mentionOptions,
      },
    )
  })

  it('registers blots with a custom Quill registry', () => {
    const mentionBlot = {}
    const globalRegistrations = []
    const registryRegistrations = []

    registerModule(
      {
        imports: {},
        register: (name, module) => {
          globalRegistrations.push([name, module])
        },
      },
      {
        name: 'blots/mention',
        module: mentionBlot,
      },
      {
        register: (module) => {
          registryRegistrations.push(module)
        },
      },
    )

    assert.deepEqual(globalRegistrations, [['blots/mention', mentionBlot]])
    assert.deepEqual(registryRegistrations, [mentionBlot])
  })

  it('registers already imported blots with a custom Quill registry', () => {
    const mentionBlot = {}
    const globalRegistrations = []
    const registryRegistrations = []

    registerModule(
      {
        imports: {
          'blots/mention': mentionBlot,
        },
        register: (name, module) => {
          globalRegistrations.push([name, module])
        },
      },
      {
        name: 'blots/mention',
        module: mentionBlot,
      },
      {
        register: (module) => {
          registryRegistrations.push(module)
        },
      },
    )

    assert.deepEqual(globalRegistrations, [])
    assert.deepEqual(registryRegistrations, [mentionBlot])
  })

  it('registers attributors with a custom Quill registry', () => {
    const mentionAttributor = {}
    const registryRegistrations = []

    registerModule(
      {
        imports: {},
        register: () => {},
      },
      {
        name: 'attributors/class/mention',
        module: mentionAttributor,
      },
      {
        register: (module) => {
          registryRegistrations.push(module)
        },
      },
    )

    assert.deepEqual(registryRegistrations, [mentionAttributor])
  })

  it('does not register Quill modules with a custom Quill registry', () => {
    const mentionModule = {}
    const registryRegistrations = []

    registerModule(
      {
        imports: {},
        register: () => {},
      },
      {
        name: 'modules/mention',
        module: mentionModule,
      },
      {
        register: (module) => {
          registryRegistrations.push(module)
        },
      },
    )

    assert.deepEqual(registryRegistrations, [])
  })
})
