const semanticRelease = require('semantic-release');
const releaserc = require('./.releaserc.json')
const pkg = require('./package.json')

const getNextVersion = async (): Promise<string> => {
  try {
    const result = await semanticRelease({
      // Core options
      branches: releaserc.branches,
      repositoryUrl: pkg.repository.url,
      dryRun: true,
      ci: false,
      plugins: ['@semantic-release/commit-analyzer']
    });

    console.log("PROCESS_ENV_CI ---->>>>>>>>>>", process.env.CI);

    if (result) {
      const { lastRelease, commits, nextRelease } = result;
      console.log(`Published ${nextRelease.type} release version ${nextRelease.version} containing ${commits.length} commits.`);
      if (lastRelease.version) console.log(`The last release was "${lastRelease.version}".`);
      return nextRelease.version
    } else {
      console.log('No release published.');
    }
  } catch (err) {
    console.error('The automated release failed with %O', err)
  }
  return ""
}

const fs = require('fs');
const csso = require('csso');
const packageConfigs = async () => {
  return {
    version: await getNextVersion()
  }
}

const prebuildPkg = 'temp/prebuild-package.json'
if (!fs.existsSync("temp")) fs.mkdirSync("temp");
packageConfigs().then((config) => {
  const content = JSON.stringify(config)
  fs.writeFile(prebuildPkg, content, (err: any) => {
    if (err) throw err;
    console.log('empty.js created');
  })
})