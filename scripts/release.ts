(() => {
  const chalk = require('chalk')
  const execa = require('execa')
  const path = require('path')
  const semanticRelease = require('semantic-release')
  // const { WritableStreamBuffer } = require('stream-buffers');
  // const stdoutBuffer = WritableStreamBuffer();
  // const stderrBuffer = WritableStreamBuffer();

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
    const nextVersion = await getNextVersion()
    await prepare(target, nextVersion)
    await release()
  }

  async function prepare(target: string, nextVersion: string) {
    const buildScript = path.resolve(__dirname, 'build.ts')
    console.log(chalk.bgCyan("Build package"))
    await execa('npx', ['ts-node', buildScript, '--nextVersion', nextVersion])
    console.log(chalk.bgCyan("Zipping distribution file"))
    await execa('zip', ['-r', `${target}-dist.zip`, '.', '-i', 'dist'])
  }

  async function release() {
    try {
      const result = await semanticRelease({
        // Core options
        branches: releaserc.branches,
        repositoryUrl: pkg.repository.url,
        plugins: releaserc.plugins
      }, {
        // Run semantic-release from `/path/to/git/repo/root` without having to change local process `cwd` with `process.chdir()`
        // cwd: '',
        // Pass the variable `MY_ENV_VAR` to semantic-release without having to modify the local `process.env`
        env: { ...process.env },
        // Store stdout and stderr to use later instead of writing to `process.stdout` and `process.stderr`
        // stdout: stdoutBuffer,
        // stderr: stderrBuffer
      });

      if (result) {
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

      // Get stdout and stderr content
      // const logs = stdoutBuffer.getContentsAsString('utf8');
      // const errors = stderrBuffer.getContentsAsString('utf8');
      // console.log(logs, errors);

    } catch (err) {
      console.error('The automated release failed with %O', err)
    }
  }

  async function getNextVersion(): Promise<string> {
    try {
      const { nextRelease } = await semanticRelease({
        branches: releaserc.branches,
        repositoryUrl: pkg.repository.url,
        dryRun: true,
        ci: false,
        plugins: ['@semantic-release/commit-analyzer']
      })
      if (nextRelease) return nextRelease.version
      else console.log('No release will bepublished')
    } catch (err) {
      console.error('Failed to retrieve next version with %O', err)
    }
    return pkg.version
  }
})()