'use strict'

const sinon = require('sinon')
const tap = require('tap')
const test = tap.test
const Arrow = require('arrow')

const findAll = require('../../../lib/methods/findAll').findAll
const server = require('../../server')
const modelUtils = require('../../../lib/utility/modelUtils')

const result = {
  rows: [{ 'first row': 1 }, { 'second row': 2 }]
}
const promise = sinon.stub().resolves(result)()
const PgClient = {
  findAll: (Model) => {
    return promise
  }
}
const findAllSpy = sinon.spy(PgClient, 'findAll')
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

test('### FindAll test with result ###', function (t) {
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

  findAll.call(connector, 'Model', (err, resp) => {
    t.notOk(err)
    t.ok(findAllSpy.calledOnce)
    t.equals(findAllSpy.firstCall.args[0], 'Model')
    t.ok(getInstanceStub.calledTwice)
    t.equals(getInstanceStub.firstCall.args[0], 'Model')
    t.deepequal(getInstanceStub.firstCall.args[1], result.rows[0])
    t.equals(getInstanceStub.secondCall.args[0], 'Model')
    t.deepequal(getInstanceStub.secondCall.args[1], result.rows[1])
    t.end()
  })
})

/* test('### FindAll test with error ###', function (t) {
  const result = {
    rows: [{ 'first row': 1 }, { 'second row': 2 }]
  }
  method = { findAll: sinon.stub().rejects('ERROR') }

  const cbspy = sinon.spy()
  findAll.call(connector, 'Model', cbspy)
  t.ok(cbspy.calledOnce)
  t.equals(cbspy.firstCall.args[0], 'ERROR')
  t.end()
}) */

test('### Stop Arrow ###', function (t) {
  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
