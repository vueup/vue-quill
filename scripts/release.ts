;(async () => {
  require('dotenv').config()
  const logger = require('./logger')
  const semanticRelease = require('semantic-release')
  const { rootDir, getPackageDir, getPackageJson } = require('./utils')

  const args = require('minimist')(process.argv.slice(2))
  const preview = args.preview
  const target = args._[0]

  // semantic-release configurations
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
            `npx ts-node ${rootDir}/scripts/build.ts ${target} --nextVersion \${nextRelease.version} && ` +
            `npx ts-node ${rootDir}/scripts/verifyRelease.ts ${target} && ` +
            `zip ${target}-dist.zip -r dist`,
        },
      ],
      '@semantic-release/changelog',
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

  if (!target) {
    logger.warning(
      'semantic-release',
      'You must specify the target package e.g. npm run release -- vue-quill'
    )
    return
  }

  if (!process.env.CI && !preview) {
    logger.warning(
      'semantic-release',
      `You can't release [${target}] locally, use --preview to get a preview of the pending release`
    )
    return
  }

  const pkgDir = getPackageDir(target)
  const pkg = getPackageJson(target)
  if (pkg.private) {
    logger.warning('semantic-release', `You can't release private package [${target}]`)
    return
  }

  try {
    logger.header(target, 'SEMANTIC RELEASE')
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
      logger.header(target, 'RELEASE RESULT')
      const { lastRelease, commits, nextRelease, releases } = result

      logger.success(
        target,
        `Published ${nextRelease.type} release version ${nextRelease.version} containing ${commits.length} commits.`
      )
      if (lastRelease.version) {
        logger.info(target, `The last release was "${lastRelease.version}".`)
      }

      for (const release of releases) {
        console.log(`The release was published with plugin "${release.pluginName}".`)
      }
    } else {
      logger.warning(target, 'No release published.')
    }
  } catch (err) {
    logger.error(target, `The automated release failed with ${err}`)
  }
})()
