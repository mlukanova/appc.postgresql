'use strict'
const test = require('tap').test
const sinon = require('sinon')
const queryUtils = require('../../../lib/utility/queryUtils')
const modelUtils = require('../../../lib/utility/modelUtils')

const Model = 'City'

test('### translateOptionsToQuery - empty options ###', function (t) {
  const translated = queryUtils.translateOptionsToQuery({}, [])
  t.ok(translated)
  t.notOk(translated.where)
  t.deepequal(translated.sel, [])
  t.notOk(translated.limit)
  t.notOk(translated.order)
  t.notOk(translated.skip)
  t.end()
})

test('### translateOptionsToQuery - sel options ###', function (t) {
  const translated = queryUtils.translateOptionsToQuery({
    sel: {
      id: 1,
      name: 1
    }
  }, ['name', 'id', 'test'])
  t.ok(translated)
  t.notOk(translated.where)
  t.deepequal(translated.sel, ['name', 'id'])
  t.notOk(translated.limit)
  t.notOk(translated.order)
  t.notOk(translated.skip)
  t.end()
})

test('### translateOptionsToQuery - unsel options ###', function (t) {
  const translated = queryUtils.translateOptionsToQuery({
    unsel: {
      id: 1,
      name: 1
    }
  }, ['name', 'id', 'test'])
  t.ok(translated)
  t.notOk(translated.where)
  t.deepequal(translated.sel, ['test'])
  t.notOk(translated.limit)
  t.notOk(translated.order)
  t.notOk(translated.skip)
  t.end()
})

test('### translateOptionsToQuery - order options ###', function (t) {
  const translated = queryUtils.translateOptionsToQuery({
    order: {
      id: 1,
      name: -1
    }
  }, ['name', 'id', 'test'])
  t.ok(translated)
  t.notOk(translated.where)
  t.deepequal(translated.sel, ['name', 'id', 'test'])
  t.notOk(translated.limit)
  t.equals(translated.order, 'id ASC,name DESC')
  t.notOk(translated.skip)
  t.end()
})

test('### translateOptionsToQuery - where $eq, limit,skip options ###', function (t) {
  const translated = queryUtils.translateOptionsToQuery({
    where: { id: { '$eq': 10 } },
    skip: 10,
    limit: 40
  }, ['name', 'id', 'test'])
  t.ok(translated)
  t.equals(translated.where, `id = '10'`)
  t.deepequal(translated.sel, ['name', 'id', 'test'])
  t.equals(translated.limit, 40)
  t.notOk(translated.order)
  t.equals(translated.skip, 10)
  t.end()
})

test('### translateOptionsToQuery - where $lte, limit,skip options ###', function (t) {
  const translated = queryUtils.translateOptionsToQuery({
    where: { id: { '$lte': 10 } },
    skip: 10,
    limit: 40
  }, ['name', 'id', 'test'])
  t.ok(translated)
  t.equals(translated.where, `id <= '10'`)
  t.deepequal(translated.sel, ['name', 'id', 'test'])
  t.equals(translated.limit, 40)
  t.notOk(translated.order)
  t.equals(translated.skip, 10)
  t.end()
})

test('### translateOptionsToQuery - where $gte, limit,skip options ###', function (t) {
  const translated = queryUtils.translateOptionsToQuery({
    where: { id: { '$gte': 10 } },
    skip: 10,
    limit: 40
  }, ['name', 'id', 'test'])
  t.ok(translated)
  t.equals(translated.where, `id >= '10'`)
  t.deepequal(translated.sel, ['name', 'id', 'test'])
  t.equals(translated.limit, 40)
  t.notOk(translated.order)
  t.equals(translated.skip, 10)
  t.end()
})

test('### translateOptionsToQuery - where $gt, limit,skip options ###', function (t) {
  const translated = queryUtils.translateOptionsToQuery({
    where: { id: { '$gt': 10 } },
    skip: 10,
    limit: 40
  }, ['name', 'id', 'test'])
  t.ok(translated)
  t.equals(translated.where, `id > '10'`)
  t.deepequal(translated.sel, ['name', 'id', 'test'])
  t.equals(translated.limit, 40)
  t.notOk(translated.order)
  t.equals(translated.skip, 10)
  t.end()
})

test('### translateOptionsToQuery - where $ne, limit,skip options ###', function (t) {
  const translated = queryUtils.translateOptionsToQuery({
    where: { id: { '$ne': 10 } },
    skip: 10,
    limit: 40
  }, ['name', 'id', 'test'])
  t.ok(translated)
  t.equals(translated.where, `id != '10'`)
  t.deepequal(translated.sel, ['name', 'id', 'test'])
  t.equals(translated.limit, 40)
  t.notOk(translated.order)
  t.equals(translated.skip, 10)
  t.end()
})

test('### translateOptionsToQuery - where $lt, limit,skip options ###', function (t) {
  const translated = queryUtils.translateOptionsToQuery({
    where: { id: { '$lt': 10 } },
    skip: 10,
    limit: 40
  }, ['name', 'id', 'test'])
  t.ok(translated)
  t.equals(translated.where, `id < '10'`)
  t.deepequal(translated.sel, ['name', 'id', 'test'])
  t.equals(translated.limit, 40)
  t.notOk(translated.order)
  t.equals(translated.skip, 10)
  t.end()
})

test('### translateOptionsToQuery - where $like, limit,skip options ###', function (t) {
  const translated = queryUtils.translateOptionsToQuery({
    where: { id: { '$like': 'TEST' } },
    skip: 10,
    limit: 40
  }, ['name', 'id', 'test'])
  t.ok(translated)
  t.equals(translated.where, `id LIKE 'TEST'`)
  t.deepequal(translated.sel, ['name', 'id', 'test'])
  t.equals(translated.limit, 40)
  t.notOk(translated.order)
  t.equals(translated.skip, 10)
  t.end()
})

test('### createQuery - findAll method ###', function (t) {
  const getNameStub = sinon.stub(modelUtils, 'getName').callsFake((Model) => { return Model })
  const getPKStub = sinon.stub(modelUtils, 'getPK').callsFake((Model) => { return 'id' })

  const query = queryUtils.createQuery(Model, 'findAll')
  t.ok(getNameStub.calledOnce)
  t.equals(getNameStub.firstCall.args[0], Model)
  t.ok(getPKStub.calledOnce)
  t.equals(getPKStub.firstCall.args[0], Model)
  t.equals(query, 'SELECT * FROM City ORDER BY id LIMIT 1000')

  getNameStub.restore()
  getPKStub.restore()
  t.end()
})

test('### queryUtils.createQuery - findByID method ###', function (t) {
  const getNameStub = sinon.stub(modelUtils, 'getName').callsFake((Model) => { return Model })
  const getPKStub = sinon.stub(modelUtils, 'getPK').callsFake((Model) => { return 'id' })

  const query = queryUtils.createQuery(Model, 'findByID')
  t.ok(getNameStub.calledOnce)
  t.equals(getNameStub.firstCall.args[0], Model)
  t.ok(getPKStub.calledOnce)
  t.equals(getPKStub.firstCall.args[0], Model)
  t.equals(query, 'SELECT * FROM City WHERE id = $1 LIMIT 1000')

  getNameStub.restore()
  getPKStub.restore()
  t.end()
})

test('### queryUtils.createQuery - deleteAll method ###', function (t) {
  const getNameStub = sinon.stub(modelUtils, 'getName').callsFake((Model) => { return Model })
  const getPKStub = sinon.stub(modelUtils, 'getPK').callsFake((Model) => { return 'id' })

  const query = queryUtils.createQuery(Model, 'deleteAll')
  t.ok(getNameStub.calledOnce)
  t.equals(getNameStub.firstCall.args[0], Model)
  t.ok(getPKStub.calledOnce)
  t.equals(getPKStub.firstCall.args[0], Model)
  t.equals(query, 'DELETE FROM City')

  getNameStub.restore()
  getPKStub.restore()
  t.end()
})

test('### queryUtils.createQuery - deleteOne method ###', function (t) {
  const getNameStub = sinon.stub(modelUtils, 'getName').callsFake((Model) => { return Model })
  const getPKStub = sinon.stub(modelUtils, 'getPK').callsFake((Model) => { return 'id' })

  const query = queryUtils.createQuery(Model, 'deleteOne')
  t.ok(getNameStub.calledOnce)
  t.equals(getNameStub.firstCall.args[0], Model)
  t.ok(getPKStub.calledOnce)
  t.equals(getPKStub.firstCall.args[0], Model)
  t.equals(query, 'DELETE FROM City WHERE id = $1')

  getNameStub.restore()
  getPKStub.restore()
  t.end()
})

test('### queryUtils.createQuery - create method ###', function (t) {
  const getNameStub = sinon.stub(modelUtils, 'getName').callsFake((Model) => { return Model })
  const getPKStub = sinon.stub(modelUtils, 'getPK').callsFake((Model) => { return 'id' })

  const query = queryUtils.createQuery(Model, 'create', ['col1', 'col2', 'col3'], ['val1', 'val2', 'val3'])
  t.ok(getNameStub.calledOnce)
  t.equals(getNameStub.firstCall.args[0], Model)
  t.ok(getPKStub.calledOnce)
  t.equals(getPKStub.firstCall.args[0], Model)
  t.equals(query, 'INSERT INTO City (col1,col2,col3) VALUES (val1,val2,val3)')

  getNameStub.restore()
  getPKStub.restore()
  t.end()
})

test('### queryUtils.createQuery - save method ###', function (t) {
  const getNameStub = sinon.stub(modelUtils, 'getName').callsFake((Model) => { return Model })
  const getPKStub = sinon.stub(modelUtils, 'getPK').callsFake((Model) => { return 'id' })

  const query = queryUtils.createQuery(Model, 'save', ['col1 = val1', 'col2 = val2', 'col3 = val3'])
  t.ok(getNameStub.calledOnce)
  t.equals(getNameStub.firstCall.args[0], Model)
  t.ok(getPKStub.calledOnce)
  t.equals(getPKStub.firstCall.args[0], Model)
  t.equals(query, 'UPDATE City SET col1 = val1,col2 = val2,col3 = val3 WHERE id = $1')

  getNameStub.restore()
  getPKStub.restore()
  t.end()
})

test('### queryUtils.createQuery - distinct method with no options ###', function (t) {
  const getNameStub = sinon.stub(modelUtils, 'getName').callsFake((Model) => { return Model })
  const getPKStub = sinon.stub(modelUtils, 'getPK').callsFake((Model) => { return 'id' })

  const query = queryUtils.createQuery(Model, 'distinct', {}, 'col1')
  t.ok(getNameStub.calledOnce)
  t.equals(getNameStub.firstCall.args[0], Model)
  t.ok(getPKStub.calledOnce)
  t.equals(getPKStub.firstCall.args[0], Model)
  t.equals(query, 'SELECT DISTINCT col1 FROM City ')

  getNameStub.restore()
  getPKStub.restore()
  t.end()
})

test('### queryUtils.createQuery - distinct method with options ###', function (t) {
  const options = {
    where: `col1 = 'test'`,
    sel: ['col1', 'col2'],
    skip: 10,
    limit: 453,
    order: 'test'
  }
  const getNameStub = sinon.stub(modelUtils, 'getName').callsFake((Model) => { return Model })
  const getPKStub = sinon.stub(modelUtils, 'getPK').callsFake((Model) => { return 'id' })

  const query = queryUtils.createQuery(Model, 'distinct', options, 'col1')

  t.ok(getNameStub.calledOnce)
  t.equals(getNameStub.firstCall.args[0], Model)
  t.ok(getPKStub.calledOnce)
  t.equals(getPKStub.firstCall.args[0], Model)
  t.equals(query, `SELECT DISTINCT col1 FROM City  WHERE col1 = 'test' ORDER BY test LIMIT 453 OFFSET 10`)

  getNameStub.restore()
  getPKStub.restore()
  t.end()
})

test('### queryUtils.createQuery - count method with no options ###', function (t) {
  const getNameStub = sinon.stub(modelUtils, 'getName').callsFake((Model) => { return Model })
  const getPKStub = sinon.stub(modelUtils, 'getPK').callsFake((Model) => { return 'id' })

  const query = queryUtils.createQuery(Model, 'count', {}, 'col1')
  t.ok(getNameStub.calledOnce)
  t.equals(getNameStub.firstCall.args[0], Model)
  t.ok(getPKStub.calledOnce)
  t.equals(getPKStub.firstCall.args[0], Model)
  t.equals(query, 'SELECT COUNT(*) FROM City')

  getNameStub.restore()
  getPKStub.restore()
  t.end()
})

test('### queryUtils.createQuery - count method with options ###', function (t) {
  const options = {
    where: `col1 = 'test'`,
    sel: ['col2'],
    skip: 10,
    limit: 453,
    order: 'test'
  }
  const getNameStub = sinon.stub(modelUtils, 'getName').callsFake((Model) => { return Model })
  const getPKStub = sinon.stub(modelUtils, 'getPK').callsFake((Model) => { return 'id' })

  const query = queryUtils.createQuery(Model, 'count', options)

  t.ok(getNameStub.calledOnce)
  t.equals(getNameStub.firstCall.args[0], Model)
  t.ok(getPKStub.calledOnce)
  t.equals(getPKStub.firstCall.args[0], Model)
  t.equals(query, `SELECT COUNT(col2) FROM City WHERE col1 = 'test' ORDER BY test LIMIT 453 OFFSET 10`)

  getNameStub.restore()
  getPKStub.restore()
  t.end()
})

test('### queryUtils.createQuery - query method with no options ###', function (t) {
  const getNameStub = sinon.stub(modelUtils, 'getName').callsFake((Model) => { return Model })
  const getPKStub = sinon.stub(modelUtils, 'getPK').callsFake((Model) => { return 'id' })

  const query = queryUtils.createQuery(Model, 'query', {}, 'col1')
  t.ok(getNameStub.calledOnce)
  t.equals(getNameStub.firstCall.args[0], Model)
  t.ok(getPKStub.calledOnce)
  t.equals(getPKStub.firstCall.args[0], Model)
  t.equals(query, 'SELECT * FROM City')

  getNameStub.restore()
  getPKStub.restore()
  t.end()
})

test('### queryUtils.createQuery - query method with options ###', function (t) {
  const options = {
    where: `col1 = 'test'`,
    sel: ['col2'],
    skip: 10,
    limit: 453,
    order: 'test'
  }
  const getNameStub = sinon.stub(modelUtils, 'getName').callsFake((Model) => { return Model })
  const getPKStub = sinon.stub(modelUtils, 'getPK').callsFake((Model) => { return 'id' })

  const query = queryUtils.createQuery(Model, 'query', options)

  t.ok(getNameStub.calledOnce)
  t.equals(getNameStub.firstCall.args[0], Model)
  t.ok(getPKStub.calledOnce)
  t.equals(getPKStub.firstCall.args[0], Model)
  t.equals(query, `SELECT col2 FROM City WHERE col1 = 'test' ORDER BY test LIMIT 453 OFFSET 10`)

  getNameStub.restore()
  getPKStub.restore()
  t.end()
})
