'use strict'

const tap = require('tap')
const test = tap.test
const sinon = require('sinon')

const fetchSchema = require('../../../lib/schema/fetchSchema').fetchSchema

const sandbox = sinon.sandbox

tap.beforeEach((done) => {
  sandbox.create()
  done()
})

tap.afterEach((done) => {
  sandbox.restore()
  done()
})

test('### fetchSchema - returns schema ###', function (t) {
  const fetchSchemaStub = sandbox.stub().resolves('schema')()
  const connector = {
    PgClient: {
      fetchSchema: () => {
        return fetchSchemaStub
      }
    }
  }
  const fetchSchemaSpy = sandbox.spy(connector.PgClient, 'fetchSchema')

  fetchSchema.call(connector, (err, resp) => {
    t.ok(resp)
    t.notOk(err)
    t.equals(resp, 'schema')
    t.ok(fetchSchemaSpy.calledOnce)
    t.end()
  })
})

test('### fetchSchema - returns error ###', function (t) {
  const fetchSchemaStub = sandbox.stub().rejects('schema')()
  const connector = {
    PgClient: {
      fetchSchema: () => {
        return fetchSchemaStub
      }
    }
  }
  const fetchSchemaSpy = sandbox.spy(connector.PgClient, 'fetchSchema')

  fetchSchema.call(connector, (err, resp) => {
    t.ok(err)
    t.equals(err.name, 'schema')
    t.ok(fetchSchemaSpy.calledOnce)
    t.end()
  })
})

test('### fetchSchema - schema already attached ###', function (t) {
  const connector = {
    schema: 'schema'
  }
  fetchSchema.call(connector, (err, resp) => {
    t.ok(resp)
    t.notOk(err)
    t.equals(resp, 'schema')
    t.end()
  })
})
