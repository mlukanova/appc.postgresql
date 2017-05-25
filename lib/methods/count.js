'use strict'
const queryUtils = require('../utility/queryUtils')

/**
 * Finds all model instances.  A maximum of 1000 models are returned.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the models.
 */
exports.count = function count (Model, options, callback) {
  const queryOptions = queryUtils.translateOptionsToQuery(options)

  this.PgClient
    .count(Model, queryOptions)
    .then((results) => {
      if (results && results.rows && results.rows.length > 0) {
        // Turn the array of instances into a collection, and return it.
        callback(null, parseInt(results.rows[0].count))
      } else {
        callback(null, 0)
      }
    })
    .catch((err) => {
      callback(err)
    })
}
