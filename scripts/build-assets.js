/*
Produces production builds and stitches together d.ts files.

To specify the package to build, simply pass its name and the desired build
formats to output (defaults to `buildOptions.formats` specified in that package,
or "esm,cjs"):

```
# name supports fuzzy match. will build all packages with name containing "dom":
npm run assets:build -- vue-quill
```
*/

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

const args = require('minimist')(process.argv.slice(2))
const targets = args._
const devOnly = args.devOnly || args.d
const prodOnly = !devOnly && (args.prodOnly || args.p)
// const sourceMap = args.sourcemap || args.s
const isRelease = args.release
const buildAllMatching = args.all || args.a
const nextVersion =
  args.nextVersion ||
  require(path.resolve(__dirname, '..', 'package.json')).version
const commit =
  args.commit || execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)

run()

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

async function buildAll(targets) {
  await runParallel(require('os').cpus().length, targets, buildAssets)
}

async function buildAssets(target) {
  const rootDir = path.resolve(__dirname, '..')
  const pkgDir = path.resolve(__dirname, `../packages/${target}`)
  const assetsConfig = require(path.resolve(pkgDir, 'assets.config.json'))

  // only build published packages for release
  if (isRelease && assetsConfig.private) return

  if (assetsConfig.css) {
    assetsConfig.css.forEach((css) => {
      const input = path.resolve(pkgDir, css.input)
      const output = path.resolve(pkgDir, css.output)
      const outputProd = path.resolve(
        pkgDir,
        path.dirname(output),
        path.parse(output).name + '.prod.css'
      )
      const inputExt = path.extname(input)

      if (inputExt === '.styl' || inputExt === '.css') {
        console.log(
          chalk.cyan(`${input} → ${path.relative(rootDir, output)}...`)
        )
        execa.sync('stylus', [input, '-o', output])
        console.log(
          chalk.green(
            `created: ${chalk.bold(path.relative(rootDir, output))}\n`
          )
        )

        // create production build
        console.log(
          chalk.cyan(`${input} → ${path.relative(rootDir, outputProd)}...`)
        )
        execa.sync('stylus', [input, '-o', outputProd, '-c'])
        console.log(
          chalk.green(
            `created: ${chalk.bold(path.relative(rootDir, outputProd))}\n`
          )
        )
      } else {
        console.log(chalk.redBright(`File extention not supported: ${input}`))
      }
    })
  }
}

function checkAllSizes(targets) {
  if (devOnly) return
  console.log()
  for (const target of targets) {
    checkAssetsSize(target)
  }
  console.log()
}

module.exports = {
  buildAssets,
}
