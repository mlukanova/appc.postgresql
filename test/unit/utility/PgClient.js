'use strict'
const tap = require('tap')
const test = tap.test
const sinon = require('sinon')
const sandbox = sinon.sandbox
const mockery = require('mockery')
const _ = require('lodash')
const pgMock = require('../../pgMock')
const queryUtils = require('../../../lib/utility/queryUtils')
const modelUtils = require('../../../lib/utility/modelUtils')

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false
})

const mock = {
  Client: pgMock
}

mockery.registerMock('pg', mock)

const PgClient = require('../../../lib/utility/PgClient')

tap.beforeEach((done) => {
  sandbox.create()
  done()
})

tap.afterEach((done) => {
  sandbox.restore()
  done()
})

test('### PgClient should be function ###', function (t) {
  t.type(PgClient, 'function')
  t.end()
})

test('### connectionPooling: false  ###', function (t) {
  const conf = {
    connectionPooling: false
  }

  const client = PgClient(conf)()
  t.type(client, 'object')
  t.ok(client.findAll)
  t.ok(client.findByID)
  t.ok(client.count)
  t.ok(client.distinct)
  t.ok(client.save)
  t.ok(client.query)
  t.ok(client.fetchSchema)
  t.ok(client.create)
  t.ok(client.deleteOne)
  t.ok(client.deleteAll)

  t.end()
})

/* test('### connectionPooling: true  ###', function (t) {
  const conf = {
    connectionPooling: true
  }

  const client = PgClient(conf)()
  t.type(client, 'object')
  t.ok(client.findAll)
  t.ok(client.findByID)
  t.ok(client.count)
  t.ok(client.distinct)
  t.ok(client.save)
  t.ok(client.query)
  t.ok(client.fetchSchema)
  t.ok(client.create)
  t.ok(client.deleteOne)
  t.ok(client.deleteAll)

  t.end()
}) */

test('### findAll - ok  case ###', function (t) {
  const testQuery = sinon.stub()
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model, method, col, val) => {
    return [testQuery, 'findAll']
  })
  const client = PgClient('conf')()
  client.findAll('Model')
    .then((res) => {
      t.ok(res)
      t.ok(createQueryStub.callCount)
      t.ok(createQueryStub.firstCall.args[0], 'Model')
      t.ok(createQueryStub.firstCall.args[1], 'findAll')
      t.ok(testQuery.calledOnce)
      t.equals(res, 'findAll')
      t.end()
    })
    .catch((err) => {
      console.log(err)
      t.end()
    })
})

test('### findAll - error  case ###', function (t) {
  const testQuery = sinon.stub()
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model, method, col, val) => {
    return [testQuery, 'findAllErr', 'fail']
  })
  const client = PgClient('conf')()
  client.findAll('Model')
    .then((res) => {
    })
    .catch((err) => {
      t.ok(err)
      t.ok(createQueryStub.callCount)
      t.ok(createQueryStub.firstCall.args[0], 'Model')
      t.ok(createQueryStub.firstCall.args[1], 'findAll')
      t.ok(testQuery.calledOnce)
      t.equals(err.name, 'findAllErr')

      t.end()
    })
})

test('### findByID - ok  case ###', function (t) {
  const testQuery = sinon.stub()
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model, method, col, val) => {
    return [testQuery, 'findByID']
  })
  const client = PgClient('conf')()
  client.findByID('Model', 'id')
    .then((res) => {
      t.ok(res)
      t.ok(createQueryStub.callCount)
      t.ok(createQueryStub.firstCall.args[0], 'Model')
      t.ok(createQueryStub.firstCall.args[1], 'findByID')
      t.ok(testQuery.calledOnce)
      t.equals(res, 'findByID')
      t.end()
    })
    .catch((err) => {
      console.log(err)
      t.end()
    })
})

test('### findByID - error  case ###', function (t) {
  const testQuery = sinon.stub()
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model, method, col, val) => {
    return [testQuery, 'findByIDErr', 'fail']
  })
  const client = PgClient('conf')()
  client.findByID('Model')
    .then((res) => {
    })
    .catch((err) => {
      t.ok(err)
      t.ok(createQueryStub.callCount)
      t.ok(createQueryStub.firstCall.args[0], 'Model')
      t.ok(createQueryStub.firstCall.args[1], 'findByIDErr')
      t.ok(testQuery.calledOnce)
      t.equals(err.name, 'findByIDErr')

      t.end()
    })
})

test('### deleteOne - ok  case ###', function (t) {
  const testQuery = sinon.stub()
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model, method, col, val) => {
    return [testQuery, 'deleteOne']
  })
  const client = PgClient('conf')()
  client.deleteOne('Model', 'id')
    .then((res) => {
      t.ok(res)
      t.ok(createQueryStub.callCount)
      t.ok(createQueryStub.firstCall.args[0], 'Model')
      t.ok(createQueryStub.firstCall.args[1], 'deleteOne')
      t.ok(testQuery.calledOnce)
      t.equals(res, 'deleteOne')
      t.end()
    })
    .catch((err) => {
      console.log(err)
      t.end()
    })
})

test('### deleteOne - error  case ###', function (t) {
  const testQuery = sinon.stub()
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model, method, col, val) => {
    return [testQuery, 'deleteOneErr', 'fail']
  })
  const client = PgClient('conf')()
  client.deleteOne('Model', 'id')
    .then((res) => {
    })
    .catch((err) => {
      t.ok(err)
      t.ok(createQueryStub.callCount)
      t.ok(createQueryStub.firstCall.args[0], 'Model')
      t.ok(createQueryStub.firstCall.args[1], 'deleteOneErr')
      t.ok(testQuery.calledOnce)
      t.equals(err.name, 'deleteOneErr')

      t.end()
    })
})

test('### deleteAll - ok  case ###', function (t) {
  const testQuery = sinon.stub()
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model, method, col, val) => {
    return [testQuery, 'deleteAll']
  })
  const client = PgClient('conf')()
  client.deleteAll('Model')
    .then((res) => {
      t.ok(res)
      t.ok(createQueryStub.callCount)
      t.ok(createQueryStub.firstCall.args[0], 'Model')
      t.ok(createQueryStub.firstCall.args[1], 'deleteAll')
      t.ok(testQuery.calledOnce)
      t.equals(res, 'deleteAll')
      t.end()
    })
    .catch((err) => {
      console.log(err)
      t.end()
    })
})

test('### deleteAll - error  case ###', function (t) {
  const testQuery = sinon.stub()
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model, method, col, val) => {
    return [testQuery, 'deleteAllErr', 'fail']
  })
  const client = PgClient('conf')()
  client.deleteAll('Model')
    .then((res) => {
    })
    .catch((err) => {
      t.ok(err)
      t.ok(createQueryStub.callCount)
      t.ok(createQueryStub.firstCall.args[0], 'Model')
      t.ok(createQueryStub.firstCall.args[1], 'deleteAllErr')
      t.ok(testQuery.calledOnce)
      t.equals(err.name, 'deleteAllErr')

      t.end()
    })
})

test('### count - ok  case ###', function (t) {
  const testQuery = sinon.stub()
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model, method, col, val) => {
    return [testQuery, 'count']
  })
  const client = PgClient('conf')()
  client.count('Model', 'options')
    .then((res) => {
      t.ok(res)
      t.ok(createQueryStub.callCount)
      t.ok(createQueryStub.firstCall.args[0], 'Model')
      t.ok(createQueryStub.firstCall.args[1], 'count')
      t.ok(createQueryStub.firstCall.args[1], 'options')
      t.ok(testQuery.calledOnce)
      t.equals(res, 'count')
      t.end()
    })
    .catch((err) => {
      console.log(err)
      t.end()
    })
})

test('### count - error  case ###', function (t) {
  const testQuery = sinon.stub()
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model, method, col, val) => {
    return [testQuery, 'count', 'fail']
  })
  const client = PgClient('conf')()
  client.count('Model', 'options')
    .then((res) => {
    })
    .catch((err) => {
      t.ok(err)
      t.ok(createQueryStub.callCount)
      t.ok(createQueryStub.firstCall.args[0], 'Model')
      t.ok(createQueryStub.firstCall.args[1], 'count')
      t.ok(createQueryStub.firstCall.args[1], 'options')
      t.ok(testQuery.calledOnce)
      t.equals(err.name, 'count')
      t.end()
    })
})

test('### query - ok  case ###', function (t) {
  const testQuery = sinon.stub()
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model, method, col, val) => {
    return [testQuery, 'query']
  })
  const client = PgClient('conf')()
  client.query('Model', 'options')
    .then((res) => {
      t.ok(res)
      t.ok(createQueryStub.callCount)
      t.ok(createQueryStub.firstCall.args[0], 'Model')
      t.ok(createQueryStub.firstCall.args[1], 'query')
      t.ok(createQueryStub.firstCall.args[2], 'options')
      t.ok(testQuery.calledOnce)
      t.equals(res, 'query')
      t.end()
    })
    .catch((err) => {
      console.log(err)
      t.end()
    })
})
test('### query - error  case ###', function (t) {
  const testQuery = sinon.stub()
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model, method, col, val) => {
    return [testQuery, 'query', 'fail']
  })
  const client = PgClient('conf')()
  client.query('Model', 'options')
    .then((res) => {
    })
    .catch((err) => {
      t.ok(err)
      t.ok(createQueryStub.callCount)
      t.ok(createQueryStub.firstCall.args[0], 'Model')
      t.ok(createQueryStub.firstCall.args[1], 'query')
      t.ok(createQueryStub.firstCall.args[2], 'options')
      t.ok(testQuery.calledOnce)
      t.equals(err.name, 'query')
      t.end()
    })
})

test('### distinct - ok  case ###', function (t) {
  const testQuery = sinon.stub()
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model, method, col, val) => {
    return [testQuery, 'distinct']
  })
  const client = PgClient('conf')()
  client.distinct('Model', 'field', 'options')
    .then((res) => {
      t.ok(res)
      t.ok(createQueryStub.callCount)
      t.ok(createQueryStub.firstCall.args[0], 'Model')
      t.ok(createQueryStub.firstCall.args[1], 'distinct')
      t.ok(createQueryStub.firstCall.args[2], 'options')
      t.ok(createQueryStub.firstCall.args[2], ['field'])
      t.ok(testQuery.calledOnce)
      t.equals(res, 'distinct')
      t.end()
    })
    .catch((err) => {
      console.log(err)
      t.end()
    })
})

test('### distinct - ok  case ###', function (t) {
  const testQuery = sinon.stub()
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model, method, col, val) => {
    return [testQuery, 'distinct', 'fail']
  })
  const client = PgClient('conf')()
  client.distinct('Model', 'field', 'options')
    .then((res) => {
    })
    .catch((err) => {
      t.ok(err)
      t.ok(createQueryStub.callCount)
      t.ok(createQueryStub.firstCall.args[0], 'Model')
      t.ok(createQueryStub.firstCall.args[1], 'distinct')
      t.ok(createQueryStub.firstCall.args[2], 'options')
      t.ok(createQueryStub.firstCall.args[2], ['field'])
      t.ok(testQuery.calledOnce)
      t.equals(err.name, 'distinct')
      t.end()
    })
})

test('### fetchSchema - ok  case ###', function (t) {
  const client = PgClient('conf')()
  client.fetchSchema('Model', 'field', 'options')
    .then((res) => {
      t.ok(res)
      t.equals(res, 'fetchSchema')
      t.end()
    })
    .catch((err) => {
      console.log(err)
      t.end()
    })
})

test('### create - ok case without dublicate ###', function (t) {
  const values = {
    name: 'test'
  }
  const testQuery = sandbox.stub()
  const dublicateStub = sandbox.stub(modelUtils, 'checkDublicate').callsFake((Model) => {
    return false
  })
  const getPKStub = sandbox.stub(modelUtils, 'getPK').callsFake((Model) => {
    return 'PK'
  })
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model) => {
    return [testQuery, 'create']
  })
  const valuesStub = sandbox.stub(_, 'values').callsFake((obj) => {
    return 'test'
  })

  const client = PgClient('conf')()
  client.create('Model', values)
    .then((res) => {
      t.ok(res)
      t.equals(res, 'create')
      t.ok(dublicateStub.calledOnce)
      t.equals(dublicateStub.firstCall.args[0], 'Model')
      t.ok(valuesStub.calledOnce)
      t.deepequal(valuesStub.firstCall.args[0], values)
      t.ok(getPKStub.calledOnce)
      t.equals(getPKStub.firstCall.args[0], 'Model')
      t.ok(createQueryStub.calledOnce)
      t.equals(createQueryStub.firstCall.args[0], 'Model')
      t.equals(createQueryStub.firstCall.args[1], 'create')
      t.deepequal(createQueryStub.firstCall.args[2], ['name'])
      t.deepequal(createQueryStub.firstCall.args[3], ['$1'])
      t.end()
    })
    .catch((err) => {
      console.log(err)
      t.end()
    })
})

test('### create - ok case with dublicate ###', function (t) {
  const values = {
    name: 'test',
    PK_ID: 20
  }
  const testQuery = sandbox.stub()
  const dublicateStub = sandbox.stub(modelUtils, 'checkDublicate').callsFake((Model) => {
    return 'PK_ID'
  })
  const getPKStub = sandbox.stub(modelUtils, 'getPK').callsFake((Model) => {
    return 'PK'
  })
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model) => {
    return [testQuery, 'create']
  })
  const valuesStub = sandbox.stub(_, 'values').callsFake((obj) => {
    return 'test'
  })

  const client = PgClient('conf')()
  client.create('Model', values)
    .then((res) => {
      t.ok(res)
      t.equals(res, 'create')
      t.ok(dublicateStub.calledOnce)
      t.equals(dublicateStub.firstCall.args[0], 'Model')
      t.ok(valuesStub.calledOnce)
      t.ok(getPKStub.calledOnce)
      t.equals(getPKStub.firstCall.args[0], 'Model')
      t.ok(createQueryStub.calledOnce)
      t.equals(createQueryStub.firstCall.args[0], 'Model')
      t.equals(createQueryStub.firstCall.args[1], 'create')
      t.deepequal(createQueryStub.firstCall.args[2], ['name', 'PK'])
      t.deepequal(createQueryStub.firstCall.args[3], ['$1', '$2'])
      t.end()
    })
    .catch((err) => {
      console.log(err)
      t.end()
    })
})

test('### create - error case with dublicate ###', function (t) {
  const values = {
    name: 'test',
    PK_ID: 20
  }
  const testQuery = sandbox.stub()
  const dublicateStub = sandbox.stub(modelUtils, 'checkDublicate').callsFake((Model) => {
    return 'PK_ID'
  })
  const getPKStub = sandbox.stub(modelUtils, 'getPK').callsFake((Model) => {
    return 'PK'
  })
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model) => {
    return [testQuery, 'create', 'fail']
  })
  const valuesStub = sandbox.stub(_, 'values').callsFake((obj) => {
    return 'test'
  })

  const client = PgClient('conf')()
  client.create('Model', values)
    .then((res) => {
    })
    .catch((err) => {
      t.ok(err)
      t.equals(err.name, 'create')
      t.ok(dublicateStub.calledOnce)
      t.equals(dublicateStub.firstCall.args[0], 'Model')
      t.ok(valuesStub.calledOnce)
      t.ok(getPKStub.calledOnce)
      t.equals(getPKStub.firstCall.args[0], 'Model')
      t.ok(createQueryStub.calledOnce)
      t.equals(createQueryStub.firstCall.args[0], 'Model')
      t.equals(createQueryStub.firstCall.args[1], 'create')
      t.deepequal(createQueryStub.firstCall.args[2], ['name', 'PK'])
      t.deepequal(createQueryStub.firstCall.args[3], ['$1', '$2'])
      t.end()
    })
})

test('### save - ok case without dublicate ###', function (t) {
  const values = {
    name: 'test'
  }
  const testQuery = sandbox.stub()
  const dublicateStub = sandbox.stub(modelUtils, 'checkDublicate').callsFake((Model) => {
    return false
  })
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model) => {
    return [testQuery, 'save']
  })
  const getPKStub = sandbox.stub(modelUtils, 'getPK').callsFake((Model) => {
    return 'PK'
  })

  const client = PgClient('conf')()
  client.save('Model', values, 'test')
    .then((res) => {
      t.ok(res)
      t.equals(res, 'save')
      t.ok(dublicateStub.calledOnce)
      t.equals(dublicateStub.firstCall.args[0], 'Model')
      t.equals(createQueryStub.firstCall.args[0], 'Model')
      t.equals(createQueryStub.firstCall.args[1], 'save')
      t.ok(getPKStub.calledOnce)
      t.equals(getPKStub.firstCall.args[0], 'Model')
      t.deepequal(createQueryStub.firstCall.args[2], [`name = 'test'`])
      t.end()
    })
    .catch((err) => {
      console.log(err)
      t.end()
    })
})

test('### save - ok case with dublicate ###', function (t) {
  const values = {
    name: 'test',
    age: 34,
    PK_ID: 10
  }
  const testQuery = sandbox.stub()
  const dublicateStub = sandbox.stub(modelUtils, 'checkDublicate').callsFake((Model) => {
    return 'PK_ID'
  })
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model) => {
    return [testQuery, 'save']
  })
  const getPKStub = sandbox.stub(modelUtils, 'getPK').callsFake((Model) => {
    return 'PK'
  })

  const client = PgClient('conf')()
  client.save('Model', values, 10)
    .then((res) => {
      t.ok(res)
      t.equals(res, 'save')
      t.ok(getPKStub.calledOnce)
      t.equals(getPKStub.firstCall.args[0], 'Model')
      t.ok(dublicateStub.calledOnce)
      t.equals(dublicateStub.firstCall.args[0], 'Model')
      t.equals(createQueryStub.firstCall.args[0], 'Model')
      t.equals(createQueryStub.firstCall.args[1], 'save')
      t.deepequal(createQueryStub.firstCall.args[2], [`name = 'test'`, `age = 34`])
      t.end()
    })
    .catch((err) => {
      console.log(err)
      t.end()
    })
})

test('### save - ok case with dublicate ###', function (t) {
  const values = {
    name: 'test',
    age: 34,
    PK_ID: 10
  }
  const testQuery = sandbox.stub()
  const dublicateStub = sandbox.stub(modelUtils, 'checkDublicate').callsFake((Model) => {
    return 'PK_ID'
  })
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model) => {
    return [testQuery, 'save']
  })
  const getPKStub = sandbox.stub(modelUtils, 'getPK').callsFake((Model) => {
    return 'PK'
  })

  const client = PgClient('conf')()
  client.save('Model', values, 15)
    .then((res) => {
      t.ok(res)
      t.equals(res, 'save')
      t.ok(getPKStub.calledOnce)
      t.equals(getPKStub.firstCall.args[0], 'Model')
      t.ok(dublicateStub.calledOnce)
      t.equals(dublicateStub.firstCall.args[0], 'Model')
      t.equals(createQueryStub.firstCall.args[0], 'Model')
      t.equals(createQueryStub.firstCall.args[1], 'save')
      t.deepequal(createQueryStub.firstCall.args[2], [`name = 'test'`, `age = 34`, `PK = 10`])
      t.end()
    })
    .catch((err) => {
      console.log(err)
      t.end()
    })
})

test('### save - error case without dublicate ###', function (t) {
  const values = {
    name: 'test'
  }
  const testQuery = sandbox.stub()
  const dublicateStub = sandbox.stub(modelUtils, 'checkDublicate').callsFake((Model) => {
    return false
  })
  const createQueryStub = sandbox.stub(queryUtils, 'createQuery').callsFake((Model) => {
    return [testQuery, 'save', 'fail']
  })
  const getPKStub = sandbox.stub(modelUtils, 'getPK').callsFake((Model) => {
    return 'PK'
  })

  const client = PgClient('conf')()
  client.save('Model', values, 'test')
    .then((res) => {
    })
    .catch((err) => {
      t.ok(err)
      t.equals(err.name, 'save')
      t.ok(getPKStub.calledOnce)
      t.equals(getPKStub.firstCall.args[0], 'Model')
      t.ok(dublicateStub.calledOnce)
      t.equals(dublicateStub.firstCall.args[0], 'Model')
      t.equals(createQueryStub.firstCall.args[0], 'Model')
      t.equals(createQueryStub.firstCall.args[1], 'save')
      t.deepequal(createQueryStub.firstCall.args[2], [`name = 'test'`])
      t.end()
    })
})
