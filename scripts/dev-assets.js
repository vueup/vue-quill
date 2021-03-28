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
  checkFileSize,
} = require('./utils')

const args = require('minimist')(process.argv.slice(2))
const targets = args._
const devOnly = args.devOnly || args.d
// const sourceMap = args.sourcemap || args.s
const isRelease = args.release
const buildAllMatching = args.all || args.a
const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)

run()

async function run() {
  if (isRelease) {
    // remove build cache for release builds to avoid outdated enum values
    await fs.remove(path.resolve(__dirname, '../node_modules/.rts2_cache'))
  }
  if (!targets.length) {
    await buildAll(allTargets)
    // checkAllSizes(allTargets)
  } else {
    await buildAll(fuzzyMatchTarget(targets, buildAllMatching, allTargets))
    // checkAllSizes(fuzzyMatchTarget(targets, buildAllMatching, allTargets))
  }
}

async function buildAll(targets) {
  await runParallel(require('os').cpus().length, targets, build)
}

async function runParallel(maxConcurrency, source, iteratorFn) {
  const ret = []
  const executing = []
  for (const item of source) {
    const p = Promise.resolve().then(() => iteratorFn(item, source))
    ret.push(p)

    if (maxConcurrency <= source.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(ret)
}

async function build(target) {
  const rootDir = path.resolve(__dirname, '..')
  const pkgDir = path.resolve(rootDir, `packages/${target}`)
  const assetsConfig = require(path.resolve(pkgDir, 'assets.config.json'))

  if (assetsConfig.css) {
    console.log(chalk.cyan(`Waiting for changes...`))
    assetsConfig.css.forEach((css) => {
      const input = path.resolve(pkgDir, css.input)
      const output = path.resolve(pkgDir, css.output)
      const inputExt = path.extname(input)

      if (inputExt === '.styl' || inputExt === '.css') {
        execa('stylus', ['-w', input, '-o', output])
      } else {
        console.log(chalk.redBright(`File extention not supported: ${input}`))
      }
    })
  }
}
