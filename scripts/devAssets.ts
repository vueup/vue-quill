/*
Produces development assets files.
To specify the package to build, simply pass its name

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
    runParallel
  } = require('./utils')

  const args = require('minimist')(process.argv.slice(2))
  const targets: string[] = args._
  // const sourceMap = args.sourcemap || args.s
  const isRelease: boolean = args.release
  const buildAllMatching: string[] = args.all || args.a

  await run()

  async function run() {
    if (isRelease) {
      // remove build cache for release builds to avoid outdated enum values
      await fs.remove(path.resolve(__dirname, '../node_modules/.rts2_cache'))
    }
    if (!targets.length) {
      await buildAll(allTargets)
    } else {
      await buildAll(fuzzyMatchTarget(targets, buildAllMatching, allTargets))
    }
  }

  async function buildAll(targets: string[]) {
    await runParallel(require('os').cpus().length, targets, build)
  }

  async function build(target: string) {
    const rootDir = path.resolve(__dirname, '..')
    const pkgDir = path.resolve(rootDir, `packages/${target}`)
    const assets = require(path.resolve(pkgDir, 'assets.config.json'))

    if (assets.css) {
      console.log(chalk.cyan(`Waiting for changes...`))
      assets.css.forEach((css: any) => {
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
})()
