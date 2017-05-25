/**
 * Disconnects from your data store.
 * @param next
 */
exports.disconnect = function (next) {
  this.PgClient = null
  next()
}
