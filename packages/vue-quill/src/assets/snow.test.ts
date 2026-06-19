import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const repoRoot = fileURLToPath(new URL('../../../..', import.meta.url))
const snowStylusPath = fileURLToPath(new URL('./snow.styl', import.meta.url))
const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx'

const compileSnowTheme = (): string =>
  execFileSync(npxCommand, ['stylus', snowStylusPath, '--print'], {
    cwd: repoRoot,
    encoding: 'utf8',
  })

describe('snow theme list styles', () => {
  it('uses Quill 2 list UI markers without legacy pseudo-elements', () => {
    const css = compileSnowTheme()

    assert.match(
      css,
      /\.ql-editor li\[data-list=bullet\] > \.ql-ui:before/,
      'bullet lists should render through Quill 2 ql-ui markers',
    )
    assert.match(
      css,
      /\.ql-editor li\[data-list=ordered\] > \.ql-ui:before/,
      'ordered lists should render through Quill 2 ql-ui markers',
    )
    assert.doesNotMatch(
      css,
      /\.ql-editor ul > li::before/,
      'Snow CSS should not emit Quill 1 bullet pseudo-elements',
    )
    assert.doesNotMatch(
      css,
      /\.ql-editor ol li:before/,
      'Snow CSS should not emit Quill 1 ordered list pseudo-elements',
    )
    assert.doesNotMatch(
      css,
      /ul\[data-checked/,
      'Snow CSS should not emit Quill 1 checklist selectors',
    )
  })
})
