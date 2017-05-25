'use strict'

const sinon = require('sinon')
const tap = require('tap')
const test = tap.test
const Arrow = require('arrow')

const findByID = require('../../../lib/methods/findByID').findByID
const server = require('../../server')
const modelUtils = require('../../../lib/utility/modelUtils')

const result = {
  rows: [{ 'first row': 1 }]
}
const promise = sinon.stub().resolves(result)()
const PgClient = {
  findByID: (Model, id) => {
    return promise
  }
}
const findByIDSpy = sinon.spy(PgClient, 'findByID')
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

test('### findByID test with result ###', function (t) {
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

  findByID.call(connector, 'Model', 'id', (err, resp) => {
    t.notOk(err)
    t.ok(findByIDSpy.calledOnce)
    t.equals(findByIDSpy.firstCall.args[0], 'Model')
    t.equals(findByIDSpy.firstCall.args[1], 'id')
    t.ok(getInstanceStub.calledOnce)
    t.equals(getInstanceStub.firstCall.args[0], 'Model')
    t.deepequal(getInstanceStub.firstCall.args[1], result.rows[0])
    t.end()
  })
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
