;(async () => {
  const fs = require('fs')
  const path = require('path')
  const chalk = require('chalk')
  const logger = require('./logger')
  const { getPackageDir, getPackageJson } = require('./utils')

  const args = require('minimist')(process.argv.slice(2))
  // const preview = args.preview
  const target = args._[0]

  if (!target) {
    logger.warning('', 'You must specify the package target e.g. [vue-quill]')
    console.log()
    return
  }

  const pkgDir: string = getPackageDir(target)
  const pkg = getPackageJson(target)
  const errors: string[] = []

  if (pkg.private === true) return

  logger.header(target, 'VERIFY RELEASE')

  // verify package main entry (index.js)
  const mainEntryPath: string = path.resolve(pkgDir, pkg.main)
  checkBuildFile(`${target} main`, mainEntryPath)

  // verify package build
  interface LoggerArgs {
    scope: string
    msg: string
    type: 'info' | 'success' | 'error' | 'warning' | 'debug'
  }
  const packageOptions = pkg.buildOptions
  const buildOutputPaths: string[] = []
  packageOptions.formats.forEach((format: string) => {
    buildOutputPaths.push(path.resolve(pkgDir, 'dist', `${target}.${format}.js`))
    if (packageOptions.prod === false) return
    buildOutputPaths.push(path.resolve(pkgDir, 'dist', `${target}.${format}.prod.js`))
  })
  checkBuildFiles(`${target} builds`, buildOutputPaths)

  // verify package type definition
  const typesPath: string = path.resolve(pkgDir, pkg.types)
  checkBuildFile(`${target} types`, typesPath)

  // verify package assets
  const packageAssets = require(path.resolve(pkgDir, 'assets.config.json'))
  const buildAssetPaths: string[] = []
  packageAssets.css.forEach((css: any) => {
    buildAssetPaths.push(path.resolve(pkgDir, `${css.output}`))
    if (packageAssets.prod === false) return
    buildAssetPaths.push(path.resolve(pkgDir, `${css.output}`))
  })
  checkBuildFiles(`${target} assets`, buildAssetPaths)

  // exit process when there's a missing file or an error
  if (errors.length) {
    logger.header(target, 'ERRORS')
    errors.forEach((error) => {
      logger.error(target, error)
    })
    process.exit(1)
  }

  function checkBuildFile(target: string, buildPath: string) {
    try {
      if (fs.existsSync(buildPath)) {
        logger.success(target, `✔  The file ${chalk.underline(buildPath)} exists.`)
      } else {
        logger.error(
          target,
          `✖  The file ${chalk.underline(buildPath)} file does not exist.`
        )
        errors.push(`Missing file: ${buildPath}`)
      }
    } catch (err) {
      logger.error(target, err)
      errors.push(err)
    }
  }

  function checkBuildFiles(target: string, buildPaths: string[]) {
    try {
      const buildResults: LoggerArgs[] = []
      for (const outputPath of buildPaths) {
        if (fs.existsSync(outputPath)) {
          buildResults.push({
            scope: path.basename(outputPath),
            msg: `The file ${chalk.underline(outputPath)} exists.`,
            type: 'success',
          })
        } else {
          buildResults.push({
            scope: path.basename(outputPath),
            msg: `The file ${chalk.underline(outputPath)} file does not exist.`,
            type: 'error',
          })
          errors.push(`Missing file: ${outputPath}`)
        }
      }
      logger.list(target, `BUILD FILES`, buildResults)
    } catch (err) {
      logger.error(target, err)
      errors.push(err)
    }
  }
})()
