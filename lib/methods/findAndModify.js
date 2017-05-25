'use strict'
const modelUtils = require('../utility/modelUtils')
const queryUtils = require('../utility/queryUtils')
/**
 * Finds one model instance and modifies it.
 * @param {Arrow.Model} Model
 * @param {ArrowQueryOptions} options Query options.
 * @param {Object} doc Attributes to modify.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the modified model.
 * @throws {Error} Failed to parse query options.
 */
exports.findAndModify = function findAndModify (Model, options, doc, callback) {
  const queryOptions = queryUtils.translateOptionsToQuery(options)
  const primaryKey = modelUtils.getPK(Model)
  const connector = this

  this.PgClient
    .query(Model, queryOptions)
    .then((results) => {
      if (results.rows.length > 0) {
        results.rows.forEach(function (row) {
          var id = row[primaryKey]
          connector.PgClient
            .save(Model, doc, id)
            .then((result) => {
              if (result.rowCount > 0) {
                callback(null, doc)
              } else {
                callback()
              }
            })
            .catch((err) => {
              callback(err)
            })
        })
      } else {
        callback()
      }
    })
    .catch((err) => {
      callback(err)
    })
}
