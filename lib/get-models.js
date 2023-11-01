const path = require('path')
const fs = require('fs/promises')
const { Sequelize } = require('sequelize')

const { checkDirectoryExists } = require('../utils')

const configPath = path.resolve('config')

const config = require(configPath)

/**
 * Get models
 *
 * @param module {string?}
 *
 * @returns {Promise<{
 *  [key: string]: typeof import('sequelize').Model,
 *  sequelize: import('sequelize').Sequelize
 * }>}
 */
module.exports = async (module) => {
  const modulesPath = path.resolve('modules')

  await checkDirectoryExists(modulesPath, "The 'modules' directory does not exist!")

  const sequelize = new Sequelize(config.database)

  if (module) {
    const modulePath = path.join(modulesPath, module)

    await checkDirectoryExists(modulePath, `Module '${module}' not found!`)

    const moduleModelsPath = path.join(modulePath, 'models')

    await checkDirectoryExists(moduleModelsPath, `Module '${module}' does not have a models folder!`)

    const modelFiles = await fs.readdir(moduleModelsPath)

    return buildModels(sequelize, moduleModelsPath, modelFiles)
  } else {
  }
}

/**
 * Build models
 *
 * @param {import('sequelize').Sequelize} sequelize - An instance of Sequelize.
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
