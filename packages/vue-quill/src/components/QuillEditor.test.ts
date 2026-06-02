import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import ts from 'typescript'

const sourceFile = ts.createSourceFile(
  'QuillEditor.ts',
  readFileSync(new URL('./QuillEditor.ts', import.meta.url), 'utf8'),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
)

const getPropertyName = (node: ts.PropertyName): string | undefined => {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node)) return node.text
  return undefined
}

const findToolbarProp = (): ts.ObjectLiteralExpression => {
  let toolbarProp: ts.ObjectLiteralExpression | undefined

  const visit = (node: ts.Node) => {
    if (
      ts.isPropertyAssignment(node) &&
      getPropertyName(node.name) === 'toolbar' &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      toolbarProp = node.initializer
      return
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)

  assert.ok(toolbarProp, 'toolbar prop should be defined')
  return toolbarProp
}

describe('QuillEditor toolbar prop', () => {
  it('accepts false to disable the toolbar', () => {
    const typeProperty = findToolbarProp().properties.find(
      (property): property is ts.PropertyAssignment =>
        ts.isPropertyAssignment(property) &&
        getPropertyName(property.name) === 'type',
    )

    assert.ok(typeProperty, 'toolbar prop should define runtime types')
    assert.match(
      typeProperty.initializer.getText(sourceFile),
      /\bBoolean\b/,
      'toolbar prop runtime types should include Boolean',
    )
  })

  it('keeps the absent toolbar prop distinct from false', () => {
    const defaultProperty = findToolbarProp().properties.find(
      (property): property is ts.PropertyAssignment =>
        ts.isPropertyAssignment(property) &&
        getPropertyName(property.name) === 'default',
    )

    assert.ok(defaultProperty, 'toolbar prop should define an explicit default')
    assert.equal(
      defaultProperty.initializer.getText(sourceFile),
      'undefined',
      'toolbar prop should not cast an absent prop to false',
    )
  })
})
