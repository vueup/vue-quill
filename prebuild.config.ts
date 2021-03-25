const semanticRelease = require('semantic-release');
const releaserc = require('./.releaserc.json')
const pkg = require('./package.json')

const getNextVersion = async (): Promise<string> => {
  try {
    const { nextRelease } = await semanticRelease({
      // Core options
      branches: releaserc.branches,
      repositoryUrl: pkg.repository.url,
      dryRun: true,
      ci: false,
      plugins: ['@semantic-release/commit-analyzer']
    });

    if (nextRelease) {
      console.log(`Published ${nextRelease.type} release version ${nextRelease.version}.`);
      return nextRelease.version
    } else {
      console.log('No release published.');
    }
  } catch (err) {
    console.error('The automated release failed with %O', err)
  }
  return ""
}

if (!process.env.CI) {
  const fs = require('fs');
  const getPackageConfigs = async () => {
    return { version: await getNextVersion() }
  }

  const pkgFileName = 'temp/prebuild-package.json'
  if (!fs.existsSync("temp")) fs.mkdirSync("temp");
  getPackageConfigs().then((config) => {
    const content = JSON.stringify(config)
    fs.writeFile(pkgFileName, content, (err: any) => {
      if (err) throw err;
      console.log(`${pkgFileName} created`);
    })
  })
}