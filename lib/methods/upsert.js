'use strict'
/**
 * Updates a model or creates the model if it cannot be found.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {String} id ID of the model to update.
 * @param {Object} doc Model attributes to set.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the updated or new model.
 */
exports.upsert = function upsert (Model, id, doc, callback) {
  if (!id) {
    this.PgClient
      .create(Model, doc)
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
  } else {
    this.PgClient.findByID(Model, id)
      .then((result) => {
        if (result && result.rows.length) {
          // get differences from instance and doc
          return this.PgClient
            .save(Model, doc, id)
            .then((result) => {
              if (result.rowCount > 0) {
                callback(null, result.rows)
              } else {
                callback()
              }
            })
            .catch((err) => {
              callback(err)
            })
        } else {
          callback(null, [])
        }
      })
      .catch((err) => {
        callback(err)
      })
  }
}
