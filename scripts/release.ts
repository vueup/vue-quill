(async () => {
  const path = require('path')
  const semanticRelease = require('semantic-release')

  const args = require('minimist')(process.argv.slice(2))
  const target = args._[0]
  const pkg = require(path.resolve(__dirname, `../packages/${target}`, 'package.json'))
  const releaserc = {
    branches: [
      'master',
      'next',
      'next-major',
      { name: 'beta', prerelease: true },
      { name: 'alpha', prerelease: true }
    ],
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      [
        '@semantic-release/exec',
        {
          prepareCmd: `npx ts-node ../../scripts/build.ts --nextVersion \$\{nextRelease.version\} && zip ${target}-dist.zip -r dist`,
        }
      ],
      '@semantic-release/npm',
      [
        '@semantic-release/github',
        {
          assets: [
            {
              path: `${target}-dist.zip`,
              name: `${target}-dist-\$\{nextRelease.gitTag\}.zip`,
              label: 'Distribution code (zip)'
            }
          ]
        }
      ]
    ]
  }

  run()

  async function run() {
    const pkgDir = path.resolve(__dirname, `../packages/${target}`)
    try {
      console.log(`\n>>>>>>>>>>>>>>>>>>>> SEMANTIC RELEASE <<<<<<<<<<<<<<<<<<<<\n`)
      const result = await semanticRelease({
        branches: releaserc.branches,
        repositoryUrl: pkg.repository.url,
        plugins: releaserc.plugins
      }, {
        cwd: pkgDir,
        env: { ...process.env }
      });

      if (result) {
        console.log(`\n>>>>>>>>>>>>>>>>>>>> RELEASE RESULT <<<<<<<<<<<<<<<<<<<<\n`)
        const { lastRelease, commits, nextRelease, releases } = result;

        console.log(`Published ${nextRelease.type} release version ${nextRelease.version} containing ${commits.length} commits.`);

        if (lastRelease.version) {
          console.log(`The last release was "${lastRelease.version}".`);
        }

        for (const release of releases) {
          console.log(`The release was published with plugin "${release.pluginName}".`);
        }
      } else {
        console.log('No release published.');
      }

    } catch (err) {
      console.error('The automated release failed with %O', err)
    }
  }
})()