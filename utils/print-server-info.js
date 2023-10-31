const chalk = require('chalk')

module.exports = (config, additionalServerFlags) => () => {
  const {
    envMode,
    app: { name },
    server: { port, host, logger, cors, rateLimit }
  } = config

  const readyInMs = (process.uptime() * 1000).toFixed(2)
  const isProduction = envMode === 'production'
  const getStyledTextYesNo = (val) => (val ? chalk.green('Yes') : chalk.red('No'))

  const serverFlags = [
    {
      label: 'Logger',
      enabled: logger,
      comment: `format: ${logger.format}`
    },
    {
      label: 'CORS',
      enabled: cors
    },
    {
      label: 'Rate Limiting',
      enabled: rateLimit
    }
  ]

  if (additionalServerFlags) {
    serverFlags.push(...additionalServerFlags)
  }

  const lines = [
    '',
    `${chalk.yellow(chalk.bold(`${name}`))} ready in ${chalk.bold(readyInMs)} ms`,
    '',
    ` ⚙  Environment: ${chalk[isProduction ? 'red' : 'green'](envMode)}`,
    ` ${chalk.green('➜')}  Local URL: http://localhost:${port}`,
    '',
    ` ${chalk.cyan(`^  Host:`)} ${host}`,
    ` ${chalk.cyan(`$  Port:`)} ${port}`,
    '',
    ...serverFlags.map((item) => {
      const line = [` ⚐  ${item.label} enabled: ${getStyledTextYesNo(item.enabled)}`]

      if (item.comment) {
        line.push(chalk.gray(`(${item.comment})`))
      }

      return chalk.magenta(line.join(' '))
    }),
    '',
    chalk.red(' ✘  Press Ctrl + C to exit.'),
    ''
  ]

  for (const line of lines) {
    console.log(line)
  }
}
