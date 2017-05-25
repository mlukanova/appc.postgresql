'use strict'

module.exports = Client

function Client (config) {
  this.connection = 'connection'
  return this
};

Client.prototype.connect = function () {
  this.connection = 'connected'
}
Client.prototype.query = function (sinonStub, values) {
  if (typeof sinonStub === 'string') {
    return Promise.resolve('fetchSchema')
  }
  if (sinonStub[2] === 'fail') {
    return sinonStub[0].rejects(sinonStub[1], values)()
  } else {
    return sinonStub[0].resolves(sinonStub[1], values)()
  }
}
