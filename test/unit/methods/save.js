'use strict'

const sinon = require('sinon')
const tap = require('tap')
const test = tap.test

const save = require('../../../lib/methods/save').save
const server = require('../../server')

const instance = {
  getPrimaryKey: () => { return 'id' },
  getChangedFields: () => { return 'payload' }
}
const result = {
  rowCount: 1
}
const promise = sinon.stub().resolves(result)()
const PgClient = {
  save: (Model) => {
    return promise
  }
}
const saveSpy = sinon.spy(PgClient, 'save')
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

test('### save test with result ###', function (t) {
  save.call(connector, 'Model', instance, (err, resp) => {
    t.notOk(err)
    t.ok(resp)
    t.ok(saveSpy.calledOnce)
    t.equals(saveSpy.firstCall.args[0], 'Model')
    t.deepequals(saveSpy.firstCall.args[1], 'payload')
    t.deepequals(saveSpy.firstCall.args[2], instance.getPrimaryKey())
    t.end()
  })
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
