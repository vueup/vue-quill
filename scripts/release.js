const chalk = require('chalk')
const execa = require('execa')

const args = require('minimist')(process.argv.slice(2))
const targets = args._

if (process.env.CI && targets[0]) {
  execa.sync('zip', ['-r', `${targets[0]}vue-quill-dist.zip`, '.', '-i', 'dist'])
  execa.sync('npx', ['semantic-release'])
} else {
  console.log(chalk.redBright("You can't run semantic-release locally"))
}
