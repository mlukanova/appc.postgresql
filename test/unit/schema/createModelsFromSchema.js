'use strict'

const test = require('tap').test
const sinon = require('sinon')
const mockery = require('mockery')

// Init mockery
mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false
})

const createModelsSpy = sinon.spy()

const translateSchemaMock = sinon.stub()

mockery.registerMock('../utility/translateSchema', translateSchemaMock)

const createModelsFromSchema = require('../../../lib/schema/createModelsFromSchema').createModelsFromSchema

test('### Should create models from schema ###', function (t) {
  translateSchemaMock.returns({})
  const connector = {
    utils: {
      load: {
        models: createModelsSpy
      }
    },
    schema: {
      test: 'schema'
    }
  }
  // Test call
  createModelsFromSchema.call(connector, { schema: null })

  t.ok(createModelsSpy.calledOnce)
  t.deepequal(createModelsSpy.firstCall.args[0], {})
  t.ok(translateSchemaMock.calledOnce)
  t.deepequal(translateSchemaMock.firstCall.args[0], connector)
  t.deepequal(translateSchemaMock.firstCall.args[1], connector.schema)
  t.end()
})

test('### Disable mockery ###', function (t) {
  mockery.deregisterMock('../utility/translateSchema', translateSchemaMock)
  mockery.disable()

  t.end()
})
