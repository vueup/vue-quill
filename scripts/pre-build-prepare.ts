function preBuildPrepare() {
  const path = require('path')
  const { createFile } = require('./utils')
  const semanticRelease = require('semantic-release')
  const releaserc = require(path.resolve(__dirname, '..', '.releaserc.json'))
  const pkg = require(path.resolve(__dirname, '..', 'package.json'))

  const getNextVersion = async (): Promise<string> => {
    try {
      const { nextRelease } = await semanticRelease({
        // Core options
        branches: releaserc.branches,
        repositoryUrl: pkg.repository.url,
        dryRun: true,
        ci: false,
        plugins: ['@semantic-release/commit-analyzer']
      })

      if (nextRelease) {
        console.log(`Published ${nextRelease.type} release version ${nextRelease.version}.`)
        return nextRelease.version
      } else {
        console.log('No release published.')
      }
    } catch (err) {
      console.error('Failed to retrieve next version with %O', err)
    }
    return pkg.version
  }

  if (process.env.CI) {
    const getPackageConfigs = async () => {
      return { version: await getNextVersion() }
    }
    getPackageConfigs().then((config) => {
      const filePath = path.resolve(__dirname, '..', 'temp/prebuild-package.json')
      const content = JSON.stringify(config)
      const message = `${filePath} created`
      createFile(filePath, content, message)
    })
  }
}

preBuildPrepare()