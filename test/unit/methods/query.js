'use strict'

const sinon = require('sinon')
const tap = require('tap')
const test = tap.test
const Arrow = require('arrow')

const query = require('../../../lib/methods/query').query
const server = require('../../server')
const queryUtils = require('../../../lib/utility/queryUtils')
const modelUtils = require('../../../lib/utility/modelUtils')

const result = {
  rows: [{ 'count': 1 }]
}
const promise = sinon.stub().resolves(result)()
const PgClient = {
  query: (Model) => {
    return promise
  }
}
const querySpy = sinon.spy(PgClient, 'query')
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

  const getInstanceStub = sandbox.stub(modelUtils, 'getInstance').callsFake((Model, row) => {
    return [{ instance: 'instance' }]
  })

  const ArrowCollectionMock = (function () {
    function ArrowCollectionMock () { }
    return ArrowCollectionMock
  })()

  const arrowCollectionSpy = sandbox.spy(function () {
    return sinon.createStubInstance(ArrowCollectionMock)
  })

  sandbox.stub(Arrow, 'Collection').callsFake(arrowCollectionSpy)

  query.call(connector, 'Model', 'options', (err, resp) => {
    t.notOk(err)
    t.ok(querySpy.calledOnce)
    t.equals(querySpy.firstCall.args[0], 'Model')
    t.equals(querySpy.firstCall.args[1], 'options')
    t.ok(getInstanceStub.calledOnce)
    t.equals(getInstanceStub.firstCall.args[0], 'Model')
    t.deepequals(getInstanceStub.firstCall.args[1], result.rows[0])
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
