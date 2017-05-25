'use strict'
const Arrow = require('arrow')
const modelUtils = require('../utility/modelUtils')
const queryUtils = require('../utility/queryUtils')
/**
 * Queries for particular model records.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {ArrowQueryOptions} options Query options.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the model records.
 * @throws {Error} Failed to parse query options.
 */
exports.query = function (Model, options, callback) {
  const columns = modelUtils.getTableColumns(Model)
  const query = queryUtils.translateOptionsToQuery(options, columns)

  this.PgClient
    .query(Model, query)
    .then((results) => {
      var rows = []
      if (results.rows.length > 0) {
        results.rows.forEach(function (row) {
          rows.push(modelUtils.getInstance(Model, row))
        })
      }
      callback(null, new Arrow.Collection(Model, rows))
    })
    .catch((err) => {
      callback(err)
    })
}
