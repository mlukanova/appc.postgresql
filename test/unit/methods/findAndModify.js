'use strict'

const sinon = require('sinon')
const tap = require('tap')
const test = tap.test

const findAndModify = require('../../../lib/methods/findAndModify').findAndModify
const server = require('../../server')
const queryUtils = require('../../../lib/utility/queryUtils')
const modelUtils = require('../../../lib/utility/modelUtils')

const result = {
  rows: [{ 'pk': 1 }]
}
const promise = sinon.stub().resolves(result)()
const PgClient = {
  query: (Model, queryOptions) => {
    return promise
  },
  save: (Model, doc, id) => {
    return promise
  }
}
const querySpy = sinon.spy(PgClient, 'query')
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

test('### findAndModify test with result ###', function (t) {
  const translateOptionsToQueryStub = sandbox.stub(queryUtils, 'translateOptionsToQuery').callsFake((options, columns) => {
    return 'options'
  })

  const getPKStub = sandbox.stub(modelUtils, 'getPK').callsFake((Model) => {
    return 'pk'
  })

  findAndModify.call(connector, 'Model', 'options', 'doc', (err, resp) => {
    t.notOk(err)
    t.ok(querySpy.calledOnce)
    t.equals(querySpy.firstCall.args[0], 'Model')
    t.equals(querySpy.firstCall.args[1], 'options')
    t.ok(saveSpy.calledOnce)
    t.equals(saveSpy.firstCall.args[0], 'Model')
    t.equals(saveSpy.firstCall.args[1], 'doc')
    t.equals(saveSpy.firstCall.args[2], 1)
    t.ok(getPKStub.calledOnce)
    t.equals(getPKStub.firstCall.args[0], 'Model')
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
