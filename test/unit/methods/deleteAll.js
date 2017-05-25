'use strict'

const sinon = require('sinon')
const tap = require('tap')
const test = tap.test

const deleteMethod = require('../../../lib/methods/deleteAll').deleteAll
const server = require('../../server')

const result = {
  affectedRows: 2
}
const promise = sinon.stub().resolves(result)()
const PgClient = {
  deleteAll: (Model) => {
    return promise
  }
}
const deleteSpy = sinon.spy(PgClient, 'deleteAll')
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

test('### delete test with result ###', function (t) {
  deleteMethod.call(connector, 'Model', (err, resp) => {
    t.notOk(err)
    t.ok(resp)
    t.ok(deleteSpy.calledOnce)
    t.equals(deleteSpy.firstCall.args[0], 'Model')
    t.end()
  })
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
