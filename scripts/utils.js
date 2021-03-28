const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const { gzipSync } = require('zlib')
const { compress } = require('brotli')

const targets = fs.readdirSync('packages').filter((f) => {
  const packageDir = path.resolve(__dirname, '..', 'packages', f)
  if (!fs.statSync(packageDir).isDirectory()) {
    return false
  }
  const packagePath = path.resolve(packageDir, 'package.json')
  if (!fs.existsSync(packagePath)) {
    return false
  }
  const pkg = require(packagePath)
  if (pkg.private && !pkg.buildOptions) {
    return false
  }
  return true
})

const targetAssets = fs.readdirSync('packages').filter((f) => {
  const packageDir = path.resolve(__dirname, '..', 'packages', f)
  if (!fs.statSync(packageDir).isDirectory()) {
    return false
  }
  const packagePath = path.resolve(packageDir, 'assets.config.json')
  if (!fs.existsSync(packagePath)) {
    return false
  }
  const assetsConfig = require(packagePath)
  if (assetsConfig.private && !assetsConfig.css) {
    return false
  }
  return true
})

function fuzzyMatchTarget(partialTargets, includeAllMatching, targets) {
  const matched = []
  partialTargets.forEach((partialTarget) => {
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

function checkBuildSize(target) {
  const pkgDir = path.resolve(`packages/${target}`)
  checkFileSize(`${pkgDir}/dist/${target}.global.prod.js`)
}

function checkAssetsSize(target, ext = '.css') {
  const pkgDir = path.resolve(`packages/${target}`)
  const distDir = path.resolve(pkgDir, 'dist')
  fs.readdir(distDir, function (err, files) {
    if (err) console.log(chalk.redBright('Unable to scan directory: ' + err))
    files.forEach((file) => {
      if (file.includes(`prod${ext}`))
        checkFileSize(path.resolve(distDir, file))
    })
  })
}

function checkFileSize(filePath) {
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

module.exports = {
  targets,
  targetAssets,
  fuzzyMatchTarget,
  runParallel,
  checkBuildSize,
  checkAssetsSize,
  checkFileSize,
}
