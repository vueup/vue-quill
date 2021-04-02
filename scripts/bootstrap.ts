// create package.json, README, etc. for packages that don't have them yet
;(() => {
  const fs = require('fs')
  const path = require('path')
  const { packagesDir, getPackageJson } = require('./utils')
  const args = require('minimist')(process.argv.slice(2))
  const version: string = getPackageJson().version
  const files: string[] = fs.readdirSync(packagesDir)

  files.forEach((shortName) => {
    if (!fs.statSync(path.join(packagesDir, shortName)).isDirectory()) {
      return
    }

    const name = `@vueup/${shortName}`
    const pkgPath = path.join(packagesDir, shortName, `package.json`)
    const pkgExists = fs.existsSync(pkgPath)
    if (pkgExists) {
      const pkg = require(pkgPath)
      if (pkg.private) {
        return
      }
    }

    if (args.force || !pkgExists) {
      const json = {
        name,
        version,
        description: name,
        main: 'index.js',
        module: `dist/${shortName}.esm-bundler.js`,
        files: [`index.js`, `dist`],
        types: `dist/${shortName}.d.ts`,
        repository: {
          type: 'git',
          url: 'git+https://github.com/vuejs/vue.git',
        },
        keywords: ['vue-quill'],
        author: 'Ahmad Luthfi Masruri',
        license: 'MIT',
        bugs: {
          url: 'https://github.com/vueup/vue-quill/issues',
        },
        homepage: `https://github.com/vueup/vue-quill/tree/dev/packages/${shortName}#readme`,
      }
      fs.writeFileSync(pkgPath, JSON.stringify(json, null, 2))
    }

    const readmePath = path.join(packagesDir, shortName, `README.md`)
    if (args.force || !fs.existsSync(readmePath)) {
      fs.writeFileSync(readmePath, `# ${name}`)
    }

    const apiExtractorConfigPath = path.join(packagesDir, shortName, `api-extractor.json`)
    if (args.force || !fs.existsSync(apiExtractorConfigPath)) {
      fs.writeFileSync(
        apiExtractorConfigPath,
        `
{
  "extends": "../../api-extractor.json",
  "mainEntryPointFilePath": "./dist/packages/<unscopedPackageName>/src/index.d.ts",
  "dtsRollup": {
    "publicTrimmedFilePath": "./dist/<unscopedPackageName>.d.ts"
  }
}
`.trim()
      )
    }

    const assetsConfigPath = path.join(packagesDir, shortName, `assets.config.json`)
    if (args.force || !fs.existsSync(assetsConfigPath)) {
      fs.writeFileSync(
        assetsConfigPath,
        `
{
  "css": [
    {
      "input": "./src/assets/css/index.css",
      "output": "./dist/${shortName}.css"
    }
  ]
}
`.trim()
      )
    }

    const srcDir = path.join(packagesDir, shortName, `src`)
    const indexPath = path.join(packagesDir, shortName, `src/index.ts`)
    if (args.force || !fs.existsSync(indexPath)) {
      if (!fs.existsSync(srcDir)) {
        fs.mkdirSync(srcDir)
      }
      fs.writeFileSync(indexPath, ``)
    }

    const nodeIndexPath = path.join(packagesDir, shortName, 'index.js')
    if (args.force || !fs.existsSync(nodeIndexPath)) {
      fs.writeFileSync(
        nodeIndexPath,
        `
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/${shortName}.cjs.prod.js')
} else {
  module.exports = require('./dist/${shortName}.cjs.js')
}
    `.trim() + '\n'
      )
    }
  })
})()
