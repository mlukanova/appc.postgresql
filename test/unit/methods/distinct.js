'use strict'

const sinon = require('sinon')
const tap = require('tap')
const test = tap.test

const distinct = require('../../../lib/methods/distinct').distinct
const server = require('../../server')
const queryUtils = require('../../../lib/utility/queryUtils')
const modelUtils = require('../../../lib/utility/modelUtils')

const result = {
  rows: [{ 'count': 1 }]
}
const promise = sinon.stub().resolves(result)()
const PgClient = {
  distinct: (Model) => {
    return promise
  }
}
const distinctSpy = sinon.spy(PgClient, 'distinct')
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

test('### query test with result ###', function (t) {
  const translateOptionsToQueryStub = sandbox.stub(queryUtils, 'translateOptionsToQuery').callsFake((options, columns) => {
    return 'options'
  })

  const getTableColumnsStub = sandbox.stub(modelUtils, 'getTableColumns').callsFake((Model) => {
    return ['col1', 'col2']
  })

  distinct.call(connector, 'Model', 'field', 'options', (err, resp) => {
    t.notOk(err)
    t.ok(distinctSpy.calledOnce)
    t.equals(distinctSpy.firstCall.args[0], 'Model')
    t.equals(distinctSpy.firstCall.args[1], 'field')
    t.equals(distinctSpy.firstCall.args[2], 'options')
    t.ok(getTableColumnsStub.calledOnce)
    t.ok(getTableColumnsStub.firstCall.args[0], 'Model')
    t.ok(translateOptionsToQueryStub.calledOnce)
    t.equals(translateOptionsToQueryStub.firstCall.args[0], 'options')
    t.deepequal(translateOptionsToQueryStub.firstCall.args[1], ['col1', 'col2'])
    t.end()
  })
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
