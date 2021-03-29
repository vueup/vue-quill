/*
Run Rollup in watch mode for development.

To specific the package to watch, simply pass its name and the desired build
formats to watch (defaults to "global"):

```
# name supports fuzzy match. will watch all packages with name containing "dom"
npm run dev -- vue-quill

# specify the format to output
npm run dev -- vue-quill --formats cjs

# Can also drop all __DEV__ blocks with:
__DEV__=false npm run dev
```
*/
(() => {
  const execa = require('execa')
  const { fuzzyMatchTarget } = require('./utils')

  const args = require('minimist')(process.argv.slice(2))
  console.log(args)
  const target: string = args._.length ? fuzzyMatchTarget(args._)[0] : 'vue-quill'
  const formats: string[] = args.formats || args.f
  const sourceMap: boolean = args.sourcemap || args.s
  const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)

  execa(
    'rollup',
    [
      '-wc',
      '--environment',
      [
        `COMMIT:${commit}`,
        `TARGET:${target}`,
        `FORMATS:${formats || 'global'}`,
        sourceMap ? `SOURCE_MAP:true` : ``,
      ]
        .filter(Boolean)
        .join(','),
    ],
    {
      stdio: 'inherit',
    }
  )
})()
