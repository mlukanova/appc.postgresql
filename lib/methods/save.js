'use strict'
/**
 * Updates a Model instance.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Arrow.Instance} instance Model instance to update.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the updated model.
 */
exports.save = function (Model, instance, callback) {
  const payload = instance.getChangedFields()

  this.PgClient
    .save(Model, payload, instance.getPrimaryKey())
    .then((result) => {
      if (result.rowCount > 0) {
        callback(null, instance)
      } else {
        callback()
      }
    })
    .catch((err) => {
      callback(err)
    })
}
