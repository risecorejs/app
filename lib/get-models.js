const path = require('path')
const fs = require('fs/promises')
const { Sequelize } = require('sequelize')

const { checkDirectoryExists, logError } = require('../utils')

const configPath = path.resolve('config')

const config = require(configPath)

module.exports = getModels

/**
 * Get models
 *
 * @param module {string?}
 *
 * @returns {Promise<{
 *  [key: string]: typeof import('sequelize').Model | { [key: string]: typeof import('sequelize').Model },
 *  sequelize: import('sequelize').Sequelize
 * }>}
 */
async function getModels(module) {
  const sequelize = new Sequelize(config.database)

  const modulesPath = path.resolve('modules')

  await checkDirectoryExists(modulesPath, "The 'modules' directory does not exist!")

  if (module) {
    const modulePath = path.join(modulesPath, module)

    await checkDirectoryExists(modulePath, `Module '${module}' not found!`)

    const moduleModelsPath = path.join(modulePath, 'models')

    await checkDirectoryExists(moduleModelsPath, `Module '${module}' does not have a models folder!`)

    const modelFiles = await fs.readdir(moduleModelsPath)

    return buildModels(sequelize, moduleModelsPath, modelFiles)
  } else {
    const moduleDirectories = await fs.readdir(modulesPath)

    const models = {}

    for (const moduleName of moduleDirectories) {
      models[moduleName] = getModels(moduleName)
    }

    models.sequelize = sequelize

    return models
  }
}

/**
 * Build models
 *
 * @param {import('sequelize').Sequelize} sequelize - The base path for module models.
 * @param {string} moduleModelsPath - The base path for module models.
 * @param {string[]} modelFiles - An array of model file names.
 *
 * @returns {{
 *  [key: string]: typeof import('sequelize').Model,
 *  sequelize: import('sequelize').Sequelize
 * }} - An object containing the Sequelize instance and model instances.
 */
function buildModels(sequelize, moduleModelsPath, modelFiles) {
  const models = {}

  for (const modelFile of modelFiles) {
    if (modelFile.endsWith('.js')) {
      const modelPath = path.join(moduleModelsPath, modelFile)

      const getModel = require(modelPath)

      const Model = getModel(sequelize)

      if (models[Model.name]) {
        logError(`Duplicate model name found: ${Model.name}! Error loading model from: ${modelPath}`)

        process.exit(1)
      }

      models[Model.name] = Model
    }
  }

  for (const [, Model] of Object.entries(models)) {
    if (Model.relations) {
      Model.relations(models)
    }
  }

  models.sequelize = sequelize

  return models
}
