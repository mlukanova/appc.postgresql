'use strict'
const test = require('tap').test
const modelUtils = require('../../../lib/utility/modelUtils')
const server = require('../../server')

var Arrow
var connector
var Categories
var Products

test('### Start Arrow ###', function (t) {
  server()
    .then((inst) => {
      Arrow = inst
      connector = Arrow.getConnector('appc.postgresql')
      console.log(connector)
      Categories = Arrow.getModel('Categories')
      Products = Arrow.getModel('Products')
      t.ok(Arrow, 'Arrow has been started')
      t.end()
    })
    .catch((err) => {
      t.threw(err)
    })
})

test('### Should get proper parent model for models that have _parent ###', function (t) {
  const Model = {
    name: 'test',
    _parent: {
      name: 'testParent',
      _parent: {
        name: 'testParent2'
      }
    }
  }
  const getName = modelUtils.getName(Model)
  t.ok(getName)
  t.equals(getName, 'testParent2')
  t.end()
})

test('### Should get proper super model for models ###', function (t) {
  const Model = {
    _supermodel: 'supermodel'
  }
  const getName = modelUtils.getName(Model)
  t.ok(getName)
  t.equals(getName, 'supermodel')
  t.end()
})

test('### Should check if the model has dublicate keys or not ###', function (t) {
  const dublicate = modelUtils.checkDublicate(Categories)

  t.notOk(dublicate)
  t.end()
})

test('### Should check if the model has dublicate keys or not ###', function (t) {
  const dublicate = modelUtils.checkDublicate(Products)

  t.ok(dublicate)
  t.equals(dublicate, 'id_ID')
  t.end()
})

test('### Should return primary key ###', function (t) {
  const pk = modelUtils.getPK(Products)
  t.equals(pk, 'id')
  t.end()
})

test('### Should return false if there is no primary key ###', function (t) {
  const modelStub = {
    name: 'test',
    fields: {
      Age: {},
      NameID: {}
    }
  }
  const pk = modelUtils.getPK(modelStub)
  t.notOk(pk)
  t.end()
})

test('### Should returns pk value ###', function (t) {
  var item = {
    id: 450
  }

  const pk = modelUtils.getPKValue(Products, item)

  t.ok(pk)
  t.equal(pk, 450)
  t.end()
})

test('### Should return instance for models without dublicate ###', function (t) {
  const item = {
    id: '50',
    Description: 'test description',
    Name: 'test name',
    Products: ['test product 1', 'test product 2']
  }

  const payload = {
    Description: 'test description',
    Name: 'test name',
    Products: ['test product 1', 'test product 2']
  }

  const instance = modelUtils.getInstance(Categories, item)

  t.ok(instance)
  t.deepequal(instance.toPayload(), payload)
  t.equal(instance.getPrimaryKey(), item.id)
  t.end()
})

test('### Should return instance for models with dublicate ###', function (t) {
  const item = {
    CategoryId: 'test id',
    Discontinued: true,
    Name: 'test name',
    QuantityPerUnit: 'test quantity',
    UnitPrice: 10,
    Category: 'test category',
    id: '50'
  }
  const payload = {
    CategoryId: 'test id',
    Discontinued: true,
    Name: 'test name',
    QuantityPerUnit: 'test quantity',
    UnitPrice: 10,
    Category: 'test category',
    id_ID: '50'
  }

  const instance = modelUtils.getInstance(Products, item)

  t.ok(instance)
  t.deepequal(instance.toPayload(), payload)
  t.equal(instance.getPrimaryKey(), item.id)
  t.end()
})

test('### Should return all fields(with PK) without dublicates ###', function (t) {
  const columns = modelUtils.getTableColumns(Products)

  t.ok(columns)
  t.deepequal(columns, ['CategoryId', 'Discontinued', 'Name', 'QuantityPerUnit', 'UnitPrice', 'Category', 'id'])
  t.end()
})

test('### Stop Arrow ###', function (t) {
  Arrow.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
