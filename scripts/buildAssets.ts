/*
Produces production assets files.
To specify the package assets to build, simply pass its name

```
# name supports fuzzy match. will build all packages with name containing "vue-quill":
npm run assets:build -- vue-quill
```
*/
;(async () => {
  const fs = require('fs-extra')
  const path = require('path')
  const execa = require('execa')
  const logger = require('./logger')
  const {
    targetAssets: allTargets,
    getPackageDir,
    fuzzyMatchTarget,
    checkAssetsSize,
    runParallel,
  } = require('./utils')

  const args: any = require('minimist')(process.argv.slice(2))
  const targets: string[] = args._
  const devOnly: boolean = args.devOnly || args.d
  const prodOnly: boolean = !devOnly && (args.prodOnly || args.p)
  const sourceMap = args.sourcemap || args.s
  const isRelease: boolean = args.release
  const buildAllMatching: string[] = args.all || args.a
  // const nextVersion: string =
  //   args.nextVersion ||
  //   require(path.resolve(__dirname, '../package.json')).version

  if (isRelease) {
    // remove build cache for release builds to avoid outdated enum values
    await fs.remove(path.resolve(__dirname, '../node_modules/.rts2_cache'))
  }
  if (!targets.length) {
    await buildAll(allTargets)
    checkAllSizes(allTargets)
  } else {
    await buildAll(fuzzyMatchTarget(targets, buildAllMatching, allTargets))
    checkAllSizes(fuzzyMatchTarget(targets, buildAllMatching, allTargets))
  }

  async function buildAll(targets: string[]) {
    await runParallel(require('os').cpus().length, targets, buildAssets)
  }

  async function buildAssets(target: string) {
    const pkgDir = getPackageDir(target)
    const assets = require(path.resolve(pkgDir, 'assets.config.json'))

    // only build published packages for release
    if (isRelease && assets.private) return
    if (!assets.css.length) return

    logger.header(target, 'BUILD ASSETS')

    for (const css of assets.css) {
      const input: string = path.resolve(pkgDir, css.input)
      const inputExt: string = path.extname(input)
      const output: string = path.resolve(pkgDir, css.output)
      const outputProd: string = path.resolve(
        pkgDir,
        path.dirname(output),
        path.parse(output).name + '.prod.css'
      )

      if (!fs.existsSync(input)) {
        console.log()
        logger.error(target, `Asset file input doesn't exist ${input}`)
        process.exit(1)
      }

      if (inputExt === '.styl' || inputExt === '.css') {
        if (!prodOnly) {
          const args: string[] = ['stylus', input, '-o', output]
          if (sourceMap) args.push('--sourcemap')
          await execa('npx', args, { stdio: 'inherit' })
        }
        // create production build
        if (!devOnly) {
          const args: string[] = ['stylus', input, '-o', outputProd, '-c']
          if (sourceMap) args.push('--sourcemap')
          await execa('npx', args, { stdio: 'inherit' })
        }
      } else {
        logger.error(target, `File extention not supported: ${input}`)
      }
    }
  }

  function checkAllSizes(targets: string[]) {
    if (devOnly) return
    console.log()
    for (const target of targets) {
      checkAssetsSize(target)
    }
    console.log()
  }
})()
