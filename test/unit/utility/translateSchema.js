'use strict'
const tap = require('tap')
const test = tap.test
const translateSchema = require('../../../lib/utility/translateSchema')
const server = require('../../server')
const sinon = require('sinon')
const src = require('../../data/schema.json')

const sandbox = sinon.sandbox
var arrow
var connector

tap.afterEach((done) => {
  sandbox.restore()
  done()
})

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

test('###  ###', function (t) {
  const schema = translateSchema(connector, src)
  t.ok(schema)
  t.end()
})

test('### Stop Arrow ###', function (t) {
  arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
