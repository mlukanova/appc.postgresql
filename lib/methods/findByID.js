'use strict'
const modelUtils = require('../utility/modelUtils')
/**
 * Finds a model instance using the primary key.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {String} id ID of the model to find.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the found model.
 */
exports.findByID = function (Model, id, callback) {
  this.PgClient.findByID(Model, id)
    .then((result) => {
      if (result && result.rows.length) {
        callback(null, modelUtils.getInstance(Model, result.rows[0]))
      } else {
        callback(null, [])
      }
    })
    .catch((err) => {
      callback(err)
    })
}
