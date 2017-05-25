'use strict'

/**
 * Creates a new Model or Collection object.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Array<Object>/Object} [values] Attributes to set on the new model(s).
 * @param {Function} callback Callback passed an Error object (or null if successful), and the new model or collection.
 * @throws {Error}
 */
exports.create = function (Model, values, callback) {
  this.PgClient
    .create(Model, values)
    .then((result) => {
      if (result && result.rowCount) {
        callback(null, result)
      } else {
        callback()
      }
    })
    .catch((err) => {
      callback(err)
    })
}
