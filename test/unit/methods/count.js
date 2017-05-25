'use strict'

const sinon = require('sinon')
const tap = require('tap')
const test = tap.test

const count = require('../../../lib/methods/count').count
const server = require('../../server')
const queryUtils = require('../../../lib/utility/queryUtils')

const result = {
  rows: [{ 'count': 1 }]
}
const promise = sinon.stub().resolves(result)()
const PgClient = {
  count: (Model) => {
    return promise
  }
}
const countSpy = sinon.spy(PgClient, 'count')
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

test('### count test with result ###', function (t) {
  const translateOptionsToQueryStub = sandbox.stub(queryUtils, 'translateOptionsToQuery').callsFake(() => {
    return 'options'
  })
  count.call(connector, 'Model', 'options', (err, resp) => {
    t.notOk(err)
    t.ok(countSpy.calledOnce)
    t.equals(countSpy.firstCall.args[0], 'Model')
    t.equals(countSpy.firstCall.args[1], 'options')
    t.ok(translateOptionsToQueryStub.calledOnce)
    t.equals(translateOptionsToQueryStub.firstCall.args[0], 'options')
    t.end()
  })
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
