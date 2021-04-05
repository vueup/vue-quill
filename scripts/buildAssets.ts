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
  const chalk = require('chalk')
  const execa = require('execa')
  const logger = require('./logger')
  const {
    targets: allTargets,
    getPackageDir,
    getAssetsConfigJson,
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
  const buildAllMatching: boolean = args.all || args.a
  // const nextVersion: string =
  //   args.nextVersion ||
  //   require(path.resolve(__dirname, '../package.json')).version

  if (isRelease) {
    // remove build cache for release builds to avoid outdated enum values
    await fs.remove(path.resolve(__dirname, '../node_modules/.rts2_cache'))
  }
  if (!targets.length) {
    logger.header(allTargets, 'BUILD ASSETS')
    await buildAll(allTargets)
    checkAllSizes(allTargets)
  } else {
    const matchedTargets = fuzzyMatchTarget(allTargets, targets, buildAllMatching)
    logger.header(matchedTargets, 'BUILD ASSETS')
    await buildAll(matchedTargets)
    checkAllSizes(matchedTargets)
  }

  async function buildAll(targets: string[]) {
    await runParallel(require('os').cpus().length, targets, buildAssets)
  }

  async function buildAssets(target: string) {
    const pkgDir = getPackageDir(target)
    const assets = getAssetsConfigJson(target)

    // only build published packages for release
    if (isRelease && assets.private) return
    if (!assets || !assets.css.length) {
      logger.warning(
        target,
        `Can't find assets configuration or file configuration ${chalk.underline(
          target + '/assets.config.json'
        )}`
      )
      return
    }

    logger.info(target, 'Compiling assets...')

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
          const commands: string[] = ['stylus', input, '-o', output]
          if (sourceMap) commands.push('--sourcemap')
          await execa('npx', commands, { stdio: 'inherit' })
        }
        // create production build
        if (!devOnly) {
          const commands: string[] = ['stylus', input, '-o', outputProd, '-c']
          if (sourceMap) commands.push('--sourcemap')
          await execa('npx', commands, { stdio: 'inherit' })
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
