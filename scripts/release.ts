;(async () => {
  const path = require('path')
  const semanticRelease = require('semantic-release')
  require('dotenv').config()
  const args = require('minimist')(process.argv.slice(2))
  const preview = args.preview
  const target = args._[0]
  const rootDir = path.resolve(__dirname, '..')

  const releaserc = {
    branches: [
      'master',
      'next',
      'next-major',
      { name: 'rc', prerelease: true },
      { name: 'beta', prerelease: true },
      { name: 'alpha', prerelease: true },
    ],
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      [
        '@semantic-release/exec',
        {
          prepareCmd:
            `npx ts-node ${rootDir}/scripts/build.ts --nextVersion \${nextRelease.version} && ` +
            `zip ${target}-dist.zip -r dist`,
        },
      ],
      '@semantic-release/npm',
      [
        '@semantic-release/github',
        {
          assets: [
            {
              path: `${target}-dist.zip`,
              name: `${target}-dist-\${nextRelease.gitTag}.zip`,
              label: 'Distribution code (zip)',
            },
          ],
        },
      ],
    ],
  }

  await run()

  async function run() {
    if (!target) {
      console.log('You must specify the target package e.g. npm run release -- vue-quill')
      return
    }

    if (!process.env.CI && !preview) {
      console.log(
        `You can't release ${target} locally, use --preview to get a preview of the pending release`
      )
      return
    }

    const pkgDir = path.resolve(__dirname, `../packages/${target}`)
    const pkg = require(path.resolve(pkgDir, 'package.json'))
    if (pkg.private) return

    try {
      console.log(`\n>>>>>>>>>>>>>>>>>>>> SEMANTIC RELEASE <<<<<<<<<<<<<<<<<<<<\n`)
      const result = await semanticRelease(
        {
          branches: releaserc.branches,
          repositoryUrl: pkg.repository.url,
          plugins: releaserc.plugins,
          dryRun: preview ? true : false,
          ci: preview ? false : true,
        },
        {
          cwd: pkgDir,
          env: { ...process.env },
        }
      )

      if (result) {
        console.log(`\n>>>>>>>>>>>>>>>>>>>> RELEASE RESULT <<<<<<<<<<<<<<<<<<<<\n`)
        const { lastRelease, commits, nextRelease, releases } = result

        console.log(
          `Published ${nextRelease.type} release version ${nextRelease.version} containing ${commits.length} commits.`
        )

        if (lastRelease.version) {
          console.log(`The last release was "${lastRelease.version}".`)
        }

        for (const release of releases) {
          console.log(`The release was published with plugin "${release.pluginName}".`)
        }
      } else {
        console.log('No release published.')
      }
    } catch (err) {
      console.error('The automated release failed with %O', err)
    }
  }
})()
