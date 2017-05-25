'use strict'
/**
 * Fetches the schema for your connector.
 *
 * For example, your schema could look something like this:
 * {
 *     objects: {
 *         person: {
 *             first_name: {
 *                 type: 'string',
 *                 required: true
 *             },
 *             last_name: {
 *                 type: 'string',
 *                 required: false
 *             },
 *             age: {
 *                 type: 'number',
 *                 required: false
 *             }
 *         }
 *     }
 * }
 *
 * @param next
 * @returns {*}
 */
exports.fetchSchema = function (next) {
  if (this.schema) { return next(null, this.schema) }
  this.PgClient
    .fetchSchema()
    .then((resp) => {
      next(null, resp)
    })
    .catch((err) => {
      next(err)
    })
}
