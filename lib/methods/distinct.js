'use strict'
const queryUtils = require('../utility/queryUtils')
const modelUtils = require('../utility/modelUtils')

/**
 * Performs a query and returns a distinct result set based on the field(s).
 * @param {Arrow.Model} Model Model class to check.
 * @param {String} field Comma-separated list of fields.
 * @param {ArrowQueryOptions} [options] Query options.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the distinct values array.
 */
exports.distinct = function distinct (Model, field, options, callback) {
  const columns = modelUtils.getTableColumns(Model)
  const queryOptions = queryUtils.translateOptionsToQuery(options, columns)

  this.PgClient
    .distinct(Model, field, queryOptions)
    .then((results) => {
      if (results.rows) {
        callback(null, results.rows)
      } else {
        callback(null, [])
      }
    })
    .catch((err) => {
      callback(err)
    })
}
