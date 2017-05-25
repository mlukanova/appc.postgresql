'use strict'

/**
 * Deletes all the data records.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Function} callback Callback passed an Error object (or null if successful), and the deleted models.
 */
exports.deleteAll = function (Model, callback) {
  this.PgClient
    .deleteAll(Model)
    .then((result) => {
      callback(null, result && (result.affectedRows || 0))
    })
    .catch((err) => {
      callback(err)
    })
}
