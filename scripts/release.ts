(() => {
  const chalk = require('chalk')
  const execa = require('execa')

  const args = require('minimist')(process.argv.slice(2))
  const targets = args._

  if (process.env.CI && targets[0]) {
    console.log("execute zip >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    execa.sync('zip', ['-r', `${targets[0]}-dist.zip`, '.', '-i', 'dist'])
    console.log("execute semantic-release >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    const a = execa.sync('npx', ['semantic-release'])
    console.log("A", a)
    console.log("finished execution >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  } else {
    console.log(chalk.redBright("You can't run semantic-release locally"))
  }
})()