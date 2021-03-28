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
  runParallel,
} = require('./utils')

const args = require('minimist')(process.argv.slice(2))
const targets = args._
const buildAllMatching = args.all || args.a
const isRelease = args.release || (args.nextVersion && args.nextVersion !== '')
const nextVersion =
  args.nextVersion ||
  require(path.resolve(__dirname, '..', 'package.json')).version

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
  await runParallel(require('os').cpus().length, targets, buildTypes)
}

async function buildTypes(target) {
  const pkgDir = path.resolve(__dirname, `../packages/${target}`)
  console.log()
  console.log(
    chalk.bold(chalk.yellow(`Rolling up type definitions for ${target}...`))
  )

  // build types
  const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor')

  const extractorConfigPath = path.resolve(pkgDir, `api-extractor.json`)
  const extractorConfig = ExtractorConfig.loadFileAndPrepare(
    extractorConfigPath
  )
  const extractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true,
  })

  if (extractorResult.succeeded) {
    // concat additional d.ts to rolled-up dts
    try {
      const typesDir = path.resolve(pkgDir, 'types')
      if (await fs.promises.access(typesDir)) {
        const dtsPath = path.resolve(pkgDir, pkg.types)
        const existing = await fs.readFile(dtsPath, 'utf-8')
        const typeFiles = await fs.readdir(typesDir)
        const toAdd = await Promise.all(
          typeFiles.map((file) => {
            return fs.readFile(path.resolve(typesDir, file), 'utf-8')
          })
        )
        await fs.writeFile(dtsPath, existing + '\n' + toAdd.join('\n'))
      }
      console.log(
        chalk.bold(chalk.green(`API Extractor completed successfully.`))
      )
    } catch (err) {
      console.log()
      console.log(
        chalk.yellow(`There's no additional .d.ts to roll-up with ${err}`)
      )
    }
  } else {
    console.error(
      `API Extractor completed with ${extractorResult.errorCount} errors` +
        ` and ${extractorResult.warningCount} warnings`
    )
    process.exitCode = 1
  }

  await fs.remove(`${pkgDir}/dist/packages`)
}

module.exports = {
  buildTypes,
}
