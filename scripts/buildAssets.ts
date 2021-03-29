/*
Produces production assets files.
To specify the package assets to build, simply pass its name

```
# name supports fuzzy match. will build all packages with name containing "vue-quill":
npm run assets:build -- vue-quill
```
*/
(async () => {
  const fs = require('fs-extra')
  const path = require('path')
  const chalk = require('chalk')
  const execa = require('execa')
  const {
    targetAssets: allTargets,
    fuzzyMatchTarget,
    checkAssetsSize,
    runParallel,
  } = require('./utils')

  const args: any = require('minimist')(process.argv.slice(2))
  const targets: string[] = args._
  const devOnly: boolean = args.devOnly || args.d
  const prodOnly: boolean = !devOnly && (args.prodOnly || args.p)
  // const sourceMap = args.sourcemap || args.s
  const isRelease: boolean = args.release
  const buildAllMatching: string[] = args.all || args.a
  // const nextVersion: string =
  //   args.nextVersion ||
  //   require(path.resolve(__dirname, '..', 'package.json')).version

  await run()

  async function run() {
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
  }

  async function buildAll(targets: string[]) {
    await runParallel(require('os').cpus().length, targets, buildAssets)
  }

  async function buildAssets(target: string) {
    const pkgDir = path.resolve(__dirname, `../packages/${target}`)
    const assets = require(path.resolve(pkgDir, 'assets.config.json'))

    // only build published packages for release
    if (isRelease && assets.private) return
    if (!assets.css.length) return
    console.log(
      chalk.cyan(`\n>>>>>>>>>>>>>>>>>>>> BUILD ASSETS <<<<<<<<<<<<<<<<<<<<\n`)
    )

    for (const css of assets.css) {
      const input = path.resolve(pkgDir, css.input)
      const inputExt = path.extname(input)
      const output = path.resolve(pkgDir, css.output)
      const outputProd = path.resolve(
        pkgDir,
        path.dirname(output),
        path.parse(output).name + '.prod.css'
      )

      if (inputExt === '.styl' || inputExt === '.css') {
        if (!prodOnly) await execa('npx', ['stylus', input, '-o', output], { stdio: 'inherit' })
        // create production build
        if (!devOnly) await execa('npx', ['stylus', input, '-o', outputProd, '-c'], { stdio: 'inherit' })
      } else {
        console.log(chalk.redBright(`File extention not supported: ${input}`))
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