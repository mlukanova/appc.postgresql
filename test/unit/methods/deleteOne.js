'use strict'

const sinon = require('sinon')
const tap = require('tap')
const test = tap.test

const deleteOne = require('../../../lib/methods/delete')['delete']
const server = require('../../server')

const instance = {
  getPrimaryKey: () => { return 'id' }
}
const promise = sinon.stub().resolves(instance)()
const PgClient = {
  deleteOne: (Model) => {
    return promise
  }
}
const deleteOneSpy = sinon.spy(PgClient, 'deleteOne')
const sandbox = sinon.sandbox

var arrow
var connector

tap.beforeEach((done) => {
  sandbox.create()
  done()
})

tap.afterEach((done) => {
  sandbox.restore()
  done()
})

test('### Start Arrow ###', function (t) {
  server()
    .then((inst) => {
      arrow = inst
      connector = arrow.getConnector('appc.postgresql')
      connector.PgClient = PgClient

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch((err) => {
      t.threw(err)
    })
})

test('### deleteOne test with result ###', function (t) {
  deleteOne.call(connector, 'Model', instance, (err, resp) => {
    t.notOk(err)
    t.ok(resp)
    t.ok(deleteOneSpy.calledOnce)
    t.equals(deleteOneSpy.firstCall.args[0], 'Model')
    t.deepequals(deleteOneSpy.firstCall.args[1], instance.getPrimaryKey())
    t.end()
  })
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
