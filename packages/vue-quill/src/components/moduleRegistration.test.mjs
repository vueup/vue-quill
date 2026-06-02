import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  getModuleOptionName,
  getModuleRegistrationName,
} from './moduleRegistration.ts'

describe('module registration names', () => {
  it('keeps full Quill registration paths intact', () => {
    assert.equal(getModuleRegistrationName('mention'), 'modules/mention')
    assert.equal(
      getModuleRegistrationName('modules/mention'),
      'modules/mention',
    )
    assert.equal(getModuleRegistrationName('blots/mention'), 'blots/mention')
  })

  it('only adds Quill module registrations to options.modules', () => {
    assert.equal(getModuleOptionName('mention'), 'mention')
    assert.equal(getModuleOptionName('modules/mention'), 'mention')
    assert.equal(getModuleOptionName('blots/mention'), undefined)
  })
})
