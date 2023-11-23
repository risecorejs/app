module.exports = {
  getModels: require('./lib/get-models'),
  printServerInfo: require('./lib/print-server-info'),
  middleware: {
    respond: require('./lib/middleware/respond')
  }
}
