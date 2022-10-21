/*
Produces development assets files.
To specify the package to build, simply pass its name

```
# name supports fuzzy match. will build all packages with name containing "vue-quill":
npm run assets:build -- vue-quill
```
*/
;(async () => {
  const path = require('path')
  const execa = require('execa')
  const logger = require('./logger')
  const { targets: allTargets, getPackageDir, fuzzyMatchTarget } = require('./utils')

  const args = require('minimist')(process.argv.slice(2))
  const target: string = args._.length ? fuzzyMatchTarget(allTargets, args._)[0] : ''
  const sourceMap = args.sourcemap || args.s

  if (target === '') {
    logger.warning('', 'You must specify the target e.g. npm run assets:dev -- vue-quill')
    return
  }

  const pkgDir = getPackageDir(target)
  const assets = require(path.resolve(pkgDir, 'assets.config.json'))

  if (assets.css) {
    const inputs: string[] = []
    const outputs: string[] = []

    for (const css of assets.css) {
      const input = path.resolve(pkgDir, css.input)
      const output = path.resolve(pkgDir, css.output)
      const inputExt = path.extname(input)
      if (inputExt === '.styl' || inputExt === '.css') {
        inputs.push(input)
        outputs.push(output)
      } else {
        logger.error(target, `File extention not supported: ${input}`)
      }
    }
    const commands: string[] = ['stylus', '-w', ...inputs, '-o', ...outputs]
    if (sourceMap) commands.push('--sourcemap')
    await execa('npx', commands, { stdio: 'inherit' })
  }

  logger.info(target, `${new Date().getUTCDate()} Waiting for changes...`)
})()
