const translateSchema = require('../utility/translateSchema')
/**
 * Creates models from your schema (see "fetchSchema" for more information on the schema).
 */
exports.createModelsFromSchema = function () {
  this.utils.load.models(translateSchema(this, this.schema))
}
