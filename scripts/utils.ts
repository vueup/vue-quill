const fs = require('fs-extra')
const chalk = require('chalk')
const path = require('path')
const { gzipSync } = require('zlib')
const { compress } = require('brotli')

const rootDir = path.resolve(__dirname, '..')
const packagesDir = path.resolve(rootDir, 'packages')

const targets: string[] = fs.readdirSync(packagesDir).filter((targetDir: string) => {
  const pkgDir = path.resolve(packagesDir, targetDir)
  if (!fs.statSync(pkgDir).isDirectory()) {
    return false
  }
  const pkgPath = path.resolve(pkgDir, 'package.json')
  if (!fs.existsSync(pkgPath)) {
    return false
  }
  const pkg = require(pkgPath)
  if (pkg.private && !pkg.buildOptions) {
    return false
  }
  return true
})

const targetAssets: string[] = fs.readdirSync(packagesDir).filter((targetDir: string) => {
  const pkgDir = path.resolve(packagesDir, targetDir)
  if (!fs.statSync(pkgDir).isDirectory()) {
    return false
  }
  const assetsPath = path.resolve(pkgDir, 'assets.config.json')
  if (!fs.existsSync(assetsPath)) {
    return false
  }
  const assets = require(assetsPath)
  if (assets.private && !assets.css) {
    return false
  }
  return true
})

function getPackageDir(target: string) {
  return path.resolve(packagesDir, target)
}

function getPackageJson(target = '') {
  if (target === '') {
    return require(path.resolve(rootDir, 'package.json'))
  }
  return require(path.resolve(packagesDir, target, 'package.json'))
}

function fuzzyMatchTarget(
  partialTargets: string[],
  includeAllMatching?: string[],
  targets?: string[]
) {
  const matched: string[] = []
  partialTargets.forEach((partialTarget) => {
    if (!targets) return
    for (const target of targets) {
      if (target.match(partialTarget)) {
        matched.push(target)
        if (!includeAllMatching) {
          break
        }
      }
    }
  })
  if (matched.length) {
    return matched
  } else {
    console.log()
    console.error(
      `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
        `Target ${chalk.underline(partialTargets)} not found!`
      )}`
    )
    console.log()

    process.exit(1)
  }
}

async function runParallel(
  maxConcurrency: number,
  source: string[],
  iteratorFn: (target: string) => Promise<void>
) {
  const ret: Promise<void>[] = []
  const executing: Promise<void>[] = []
  for (const item of source) {
    const p = Promise.resolve().then(() => iteratorFn(item))
    ret.push(p)

    if (maxConcurrency <= source.length) {
      const e: Promise<any> = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(ret)
}

function checkBuildSize(target: string) {
  const pkgDir = getPackageDir(target)
  checkFileSize(`${pkgDir}/dist/${target}.global.prod.js`)
}

function checkAssetsSize(target: string, ext = '.css') {
  const pkgDir = getPackageDir(target)
  const distDir = path.resolve(pkgDir, 'dist')
  fs.readdir(distDir, (err: string, files: string[]) => {
    if (err) console.log(chalk.redBright('Unable to scan directory: ' + err))
    files.forEach((file: string) => {
      if (file.includes(`prod${ext}`)) checkFileSize(path.resolve(distDir, file))
    })
  })
}

function checkFileSize(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return
  }
  const file = fs.readFileSync(filePath)
  const minSize = (file.length / 1024).toFixed(2) + 'kb'
  const gzipped = gzipSync(file)
  const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb'
  const compressed = compress(file)
  const compressedSize = (compressed.length / 1024).toFixed(2) + 'kb'
  console.log(
    `${chalk.gray(
      chalk.bold(path.basename(filePath))
    )} min:${minSize} / gzip:${gzippedSize} / brotli:${compressedSize}`
  )
}

async function generateTypes(target: string) {
  const pkgDir = getPackageDir(target)
  console.log()
  console.log(chalk.bold(chalk.yellow(`Rolling up type definitions for ${target}...`)))

  // build types
  const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor')
  const extractorConfigPath = path.resolve(pkgDir, `api-extractor.json`)
  const extractorConfig = ExtractorConfig.loadFileAndPrepare(extractorConfigPath)
  const extractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true,
  })

  if (extractorResult.succeeded) {
    // concat additional d.ts to rolled-up dts
    const pkg = getPackageJson(target)
    try {
      const typesDir = path.resolve(pkgDir, 'types')
      await fs.promises.access(typesDir).then(async () => {
        const dtsPath = path.resolve(pkgDir, pkg.types)
        const existing = await fs.readFile(dtsPath, 'utf-8')
        const typeFiles = await fs.readdir(typesDir)
        const toAdd = await Promise.all(
          typeFiles.map((file: string) => {
            return fs.readFile(path.resolve(typesDir, file), 'utf-8')
          })
        )
        await fs.writeFile(dtsPath, existing + '\n' + toAdd.join('\n'))
      })
      console.log(chalk.bold(chalk.green(`API Extractor completed successfully.`)))
    } catch (err) {
      console.log()
      console.log(chalk.yellow(`There's no additional .d.ts to roll-up with ${err}`))
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
  rootDir,
  packagesDir,
  targets,
  targetAssets,
  getPackageDir,
  getPackageJson,
  fuzzyMatchTarget,
  runParallel,
  checkBuildSize,
  checkAssetsSize,
  checkFileSize,
  generateTypes,
}
