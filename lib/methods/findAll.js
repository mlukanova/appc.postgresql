'use strict'
const modelUtils = require('../utility/modelUtils')
const Arrow = require('arrow')
/**
 * Finds all model instances.  A maximum of 1000 models are returned.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the models.
 */
exports.findAll = function findAll (Model, callback) {
  this.PgClient.findAll(Model)
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
