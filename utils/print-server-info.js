const chalk = require('chalk')

module.exports = (config) => () => {
  const {
    envMode,
    app: { name },
    server: { port, host, logger, cors, rateLimit }
  } = config

  const readyInMs = (process.uptime() * 1000).toFixed(2)
  const isProduction = envMode === 'production'
  const getStyledTextYesNo = (val) => (val ? chalk.green('Yes') : chalk.red('No'))

  const lines = [
    '',
    `${chalk.yellow(chalk.bold(`${name}`))} ready in ${chalk.bold(readyInMs)} ms`,
    '',
    `⚙  Environment: ${chalk[isProduction ? 'red' : 'green'](envMode)}`,
    `${chalk.green('➜')}  Local URL: http://localhost:${port}`,
    '',
    `${chalk.cyan(`^  Host:`)} ${host}`,
    `${chalk.cyan(`$  Port:`)} ${port}`,
    '',
    chalk.magenta(
      `⚐  Logger enabled: ${getStyledTextYesNo(logger) + (logger ? chalk.gray(` (format: ${logger.format})`) : '')}`
    ),
    chalk.magenta(`⚐  CORS enabled: ${getStyledTextYesNo(cors)}`),
    chalk.magenta(`⚐  Rate Limiting enabled: ${getStyledTextYesNo(rateLimit)}`),
    '',
    chalk.red('✘  Press Ctrl + C to exit.'),
    ''
  ]

  for (const line of lines) {
    console.log('  ' + line)
  }
}
