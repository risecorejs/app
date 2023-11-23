const httpStatusCodes = require('http-status-codes')

module.exports = function (req, res, next) {
  /**
   * OK
   *
   * @param {object} responseBody - The response body.
   */
  res.ok = (responseBody) => {
    const response = responseBody || {}

    response.status ||= 200
    response.message ||= httpStatusCodes.getStatusText(response.status)

    return res.status(response.status).json(response)
  }

  /**
   * ERROR
   *
   * @param {any} err - The error object.
   * @param {boolean} printToConsole - Whether to print the error to the console.
   */
  res.error = (err, printToConsole) => {
    if (printToConsole) {
      console.error(err)
    }

    const response = {}

    if (err.errorDetails) {
      Object.assign(response, err.errorDetails)
    }

    response.status ||= err.status || 500
    response.message ||= err.message || httpStatusCodes.getStatusText(response.status)

    return res.status(response.status).json(response)
  }

  next()
}
