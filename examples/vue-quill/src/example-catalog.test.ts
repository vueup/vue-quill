import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  exampleSections,
  requiredCoverage,
  themeExamples,
  toolbarExamples,
} from './example-catalog.ts'

describe('Vue Quill example catalog', () => {
  it('covers the core public usage patterns', () => {
    assert.deepEqual(
      exampleSections.map((section) => section.id),
      [
        'basic',
        'model',
        'toolbars',
        'modules',
        'themes',
        'read-only',
        'events',
        'real-world',
      ],
    )
    assert.deepEqual(requiredCoverage, [
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
    ])
  })

  it('documents supported toolbar and theme variations', () => {
    assert.deepEqual(
      toolbarExamples.map((toolbar) => toolbar.id),
      ['minimal', 'array', 'custom-container'],
    )
    assert.deepEqual(
      themeExamples.map((theme) => theme.value),
      ['snow', 'bubble', ''],
    )
  })
})
