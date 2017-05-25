'use strict'

const sinon = require('sinon')
const mockery = require('mockery')
const test = require('tap').test

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false
})

const pg = (conf) => { }
const PgClient = sinon.stub().callsFake((conf) => { return pg })

mockery.registerMock('pg', pg)
mockery.registerMock('../utility/PgClient', PgClient)

const connect = require('../../../lib/lifecycle/connect').connect
const server = require('../../server')

var arrow
var connector

test('### Start Arrow ###', function (t) {
  server()
    .then((inst) => {
      arrow = inst
      connector = arrow.getConnector('appc.postgresql')

      t.ok(arrow, 'Arrow has been started')
      t.end()
    })
    .catch((err) => {
      t.threw(err)
    })
})

test('### Check if PgClient is correctly attached to the connector ###', function (t) {
  const sandbox = sinon.sandbox.create()
  var next = sinon.spy()
  connect.call(connector, next)
  t.ok(next.calledOnce)
  t.equals(next.firstCall.args[0], undefined)
  t.ok(PgClient.calledOnce)
  t.equals(PgClient.firstCall.args[0], connector.config)
  t.end()

  sandbox.restore()
})

test('### Stop Arrow ###', function (t) {
  mockery.disable()

  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
