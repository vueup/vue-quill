const chalk = require('chalk')
const PRINT_HEADER_WIDTH = 80
const PRINT_LABEL_WIDTH = 9

// // Test logger
// header(['vue-quill', 'file-size', 'file-size', 'file-size'], 'THIS IS MY MESSA')
// success(['vue-quill', 'file-size'], `File assets input doesn't exist right now`)
// error(['vue-quill', 'file-size'], `File assets input doesn't exist right now`)
// warning(['vue-quill', 'file-size'], `File assets input doesn't exist right now`)
// info(['vue-quill', 'file-size'], `File assets input doesn't exist right now`)
// debug(['vue-quill', 'file-size'], `File assets input doesn't exist right now`)
// list('vue-quill', 'Build Output', [
//   { scope: 'my-schope 1', msg: 'This is my message', type: 'info' },
//   { scope: 'my-schope 2', msg: 'This is my message', type: 'warning' },
//   { scope: 'my-schope 3', msg: 'This is my message', type: 'error' },
// ])

function header(scopes: string | string[], msg: string) {
  const spacedHeader = getSpacedHeader(`✦ ${msg} [${formatScopes(scopes)}] ✦`)
  const printWidth =
    spacedHeader.length > PRINT_HEADER_WIDTH ? spacedHeader.length : PRINT_HEADER_WIDTH
  const header =
    `┏${'━'.repeat(printWidth)}┓\n` +
    `┃${spacedHeader}┃\n` +
    `┗${'━'.repeat(printWidth)}┛`
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

function debug(scopes: string | string[], msg: string) {
  console.log(
    `${chalk.bold(chalk.bgMagenta(getSpacedLabel(' DEBUG')))}` +
      `${chalk.bold(chalk.inverse(` ${formatScopes(scopes)} `))}` +
      `${chalk.bgMagenta(' ')} ${chalk.magenta(msg)}`
  )
  console.log()
}

function list(scope: string, msg: string, list: any[]) {
  let headerType = 'success'
  for (const item of list) {
    if (item.type === 'error') {
      headerType = item.type
      break
    } else if (item.type === 'warning') {
      headerType = item.type
    }
  }

  if (headerType === 'error') error(scope, '✖  ' + msg)
  else if (headerType === 'warning') warning(scope, '⚠  ' + msg)
  else success(scope, '✔  ' + msg)

  list.forEach((item: any) => {
    let subScope: string
    if (item.type === 'error') {
      subScope = chalk.red('✖  ' + chalk.bold(chalk.underline(item.scope)))
    } else if (item.type === 'warning') {
      subScope = chalk.yellow('⚠  ' + chalk.bold(chalk.underline(item.scope)))
    } else {
      subScope = chalk.green('✔  ' + chalk.bold(chalk.underline(item.scope)))
    }
    console.log(`${subScope}  ${item.msg}`)
  })
  console.log()
}

function table(dataTable: any[]) {
  console.table(dataTable)
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
  debug,
  list,
  table,
}
