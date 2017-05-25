'use strict'

const sinon = require('sinon')
const tap = require('tap')
const test = tap.test

const upsert = require('../../../lib/methods/upsert').upsert
const server = require('../../server')

const result = {
  rows: [{ 'pk': 1 }],
  rowCount: 1
}

const promise = sinon.stub().resolves(result)()

const PgClient = {
  create: (Model, queryOptions) => {
    return promise
  },
  findByID: (Model, id) => {
    return promise
  },
  save: (Model, doc, id) => {
    return promise
  }
}
const createSpy = sinon.spy(PgClient, 'create')
const findByIDSpy = sinon.spy(PgClient, 'findByID')
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

test('### upsert test without id ###', function (t) {
  upsert.call(connector, 'Model', null, 'doc', (err, resp) => {
    t.notOk(err)
    t.ok(createSpy.calledOnce)
    t.equals(createSpy.firstCall.args[0], 'Model')
    t.equals(createSpy.firstCall.args[1], 'doc')
    t.end()
  })
})

test('### upsert test with id ###', function (t) {
  upsert.call(connector, 'Model', 'id', 'doc', (err, resp) => {
    t.notOk(err)
    t.ok(findByIDSpy.calledOnce)
    t.equals(findByIDSpy.firstCall.args[0], 'Model')
    t.equals(findByIDSpy.firstCall.args[1], 'id')
    t.ok(saveSpy.calledOnce)
    t.equals(saveSpy.firstCall.args[0], 'Model')
    t.equals(saveSpy.firstCall.args[1], 'doc')
    t.equals(saveSpy.firstCall.args[2], 'id')

    t.end()
  })
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
