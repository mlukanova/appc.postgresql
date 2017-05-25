const PgClient = require('../utility/PgClient')
const utils = require('appc-connector-utils')
const Arrow = require('arrow')

/**
 * Connects to your data store; this connection can later be used by your connector's methods.
 * @param next
 */
exports.connect = function (next) {
  this.PgClient = PgClient(this.config)()
  this.utils = utils(Arrow, this)
  next()
}
