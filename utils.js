const fs = require('fs/promises')
const chalk = require('chalk')

module.exports = {
  checkDirectoryExists,
  logSuccess,
  logError
}

/**
 * Check directory exists
 *
 * @param folderPath {string}
 * @param errorMessage {string}
 *
 * @returns {Promise<void>}
 */
async function checkDirectoryExists(folderPath, errorMessage) {
  try {
    await fs.access(folderPath)
  } catch (err) {
    if (err.code === 'ENOENT') {
      logError(errorMessage)

      process.exit(1)
    } else {
      throw err
    }
  }
}

/**
 * Log success
 *
 * @param text {string}
 *
 * @returns {void}
 */
function logSuccess(text) {
  console.log(`${chalk.red('✔')} ${text}`)
}

/**
 * Log error
 *
 * @param text {string}
 *
 * @returns {void}
 */
function logError(text) {
  console.log(`${chalk.red('✖')} ${text}`)
}
