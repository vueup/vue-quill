const chalk = require('chalk')
const PRINT_HEADER_WIDTH = 70
const PRINT_LABEL_WIDTH = 10

// // Test logger
// header(['vue-quill', 'file-size', 'file-size', 'file-size'], 'THIS IS MY MESSA')
// success(['vue-quill', 'file-size'], `File assets input doesn't exist right now`)
// error(['vue-quill', 'file-size'], `File assets input doesn't exist right now`)
// warning(['vue-quill', 'file-size'], `File assets input doesn't exist right now`)
// info(['vue-quill', 'file-size'], `File assets input doesn't exist right now`)

function header(scopes: string | string[], msg: string) {
  const spacedHeader = getSpacedHeader(`✦ ${msg} [${formatScopes(scopes)}] ✦`)
  const printWidth =
    spacedHeader.length > PRINT_HEADER_WIDTH ? spacedHeader.length : PRINT_HEADER_WIDTH
  const header = `
${'┏' + '━'.repeat(printWidth) + '┓'}
${'┃' + spacedHeader + '┃'}
${'┗' + '━'.repeat(printWidth) + '┛'}
  `.trim()
  console.log()
  console.log(chalk.bold(chalk.cyan(header)))
  console.log()
}

function info(scopes: string | string[], msg: string) {
  console.log(
    `${chalk.bold(chalk.bgBlue(getSpacedLabel(' INFO')))}` +
      `${chalk.bold(chalk.inverse(` ${formatScopes(scopes)} `))}` +
      `${chalk.bgBlue(' ')} ${chalk.blue(msg)}`
  )
  console.log()
}

function success(scopes: string | string[], msg: string) {
  console.log(
    `${chalk.bold(chalk.bgGreen(getSpacedLabel(' SUCCESS')))}` +
      `${chalk.bold(chalk.inverse(` ${formatScopes(scopes)} `))}` +
      `${chalk.bgGreen(' ')} ${chalk.green(msg)}`
  )
  console.log()
}

function error(scopes: string | string[], msg: string) {
  console.error(
    `${chalk.bold(chalk.bgRed(getSpacedLabel(' ERROR')))}` +
      `${chalk.bold(chalk.inverse(` ${formatScopes(scopes)} `))}` +
      `${chalk.bgRed(' ')} ${chalk.red(msg)}`
  )
  console.log()
}

function warning(scopes: string | string[], msg: string) {
  console.log(
    `${chalk.bold(chalk.bgYellow(getSpacedLabel(' WARNING')))}` +
      `${chalk.bold(chalk.inverse(` ${formatScopes(scopes)} `))}` +
      `${chalk.bgYellow(' ')} ${chalk.yellow(msg)}`
  )
  console.log()
}

function formatScopes(scopes: string | string[]) {
  if (Array.isArray(scopes)) {
    return scopes.join(', ')
  }
  return scopes
}

function getSpacedLabel(msg: string) {
  const countSpace = PRINT_LABEL_WIDTH - msg.length
  return msg + ' '.repeat(countSpace)
}

function getSpacedHeader(msg: string) {
  const printWidth =
    msg.length + 4 > PRINT_HEADER_WIDTH ? msg.length + 4 : PRINT_HEADER_WIDTH
  const countSpace: number = (printWidth - msg.length) / 2
  const extraEndSpace: number = (printWidth - msg.length) % 2
  return ' '.repeat(countSpace) + msg + ' '.repeat(countSpace + extraEndSpace)
}

module.exports = {
  header,
  info,
  success,
  error,
  warning,
}
