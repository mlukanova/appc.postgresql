'use strict'

const sinon = require('sinon')
const tap = require('tap')
const test = tap.test

const create = require('../../../lib/methods/create').create
const server = require('../../server')

const result = {
  rowCount: 1
}
const promise = sinon.stub().resolves(result)()
const PgClient = {
  create: (Model) => {
    return promise
  }
}
const createSpy = sinon.spy(PgClient, 'create')
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

test('### create test with result ###', function (t) {
  create.call(connector, 'Model', 'values', (err, resp) => {
    t.notOk(err)
    t.ok(resp)
    t.ok(createSpy.calledOnce)
    t.equals(createSpy.firstCall.args[0], 'Model')
    t.equals(createSpy.firstCall.args[1], 'values')
    t.end()
  })
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
