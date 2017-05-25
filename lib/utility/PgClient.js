'use strict'
const pg = require('pg')
const modelUtils = require('./modelUtils')
const queryUtils = require('./queryUtils')
const _ = require('lodash')

var client

module.exports = (connConfig) => {
  if (connConfig.connectionPooling) {
    client = new pg.Pool(connConfig)
  } else {
    client = new pg.Client(connConfig)
    // should release the connection after each query...
  }
  client.connect()
  return (connConfig) => new PgClient(connConfig)
}

/**
 * PgClient Constructor
 *
 * @param {*} name
 * @returns
 */
function PgClient () {
  return this
}

PgClient.prototype.query = function query (Model, options) {
  return new Promise((resolve, reject) => {
    const query = queryUtils.createQuery(Model, 'query', options)
    client.query(query)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

PgClient.prototype.count = function count (Model, options) {
  return new Promise((resolve, reject) => {
    const query = queryUtils.createQuery(Model, 'count', options)
    client.query(query)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

PgClient.prototype.fetchSchema = function fetchSchema () {
  return new Promise((resolve, reject) => {
    var queryStr = `SELECT relname AS table_name,attname::varchar as column_name,CASE WHEN attnotnull THEN 'true' ELSE 'false' END AS is_nullable,
    format_type(atttypid, atttypmod) AS data_type,adsrc AS column_default , indisprimary
    FROM pg_attribute a
    LEFT JOIN pg_class ON pg_class.oid = attrelid
    LEFT JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
    LEFT JOIN pg_attrdef ON pg_attrdef.adrelid = pg_class.oid AND adnum = a.attnum
    LEFT JOIN pg_index i ON a.attrelid = i.indrelid
                     AND a.attnum = ANY(i.indkey)
    WHERE pg_namespace.nspname = 'public'
    AND relkind IN ('r', 'v', 'm')
    AND a.attisdropped = False 
    AND attnum > 0
    ORDER BY relname`
    client.query(queryStr)
      .then((resp) => {
        resolve(resp)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

PgClient.prototype.findAll = function findAll (Model) {
  return new Promise((resolve, reject) => {
    const query = queryUtils.createQuery(Model, 'findAll')
    client.query(query)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

PgClient.prototype.findByID = function findByID (Model, id) {
  return new Promise((resolve, reject) => {
    const queryStr = queryUtils.createQuery(Model, 'findByID')
    client.query(queryStr, [id])
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

PgClient.prototype.deleteAll = function deleteAll (Model) {
  return new Promise((resolve, reject) => {
    const queryStr = queryUtils.createQuery(Model, 'deleteAll')
    client.query(queryStr)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

PgClient.prototype.deleteOne = function deleteOne (Model, id) {
  return new Promise((resolve, reject) => {
    const queryStr = queryUtils.createQuery(Model, 'deleteOne')
    client.query(queryStr, [id])
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

PgClient.prototype.create = function create (Model, values) {
  return new Promise((resolve, reject) => {
    const dublicate = modelUtils.checkDublicate(Model)
    const primaryKeyColumn = modelUtils.getPK(Model)

    if (dublicate && (values[dublicate] || values[dublicate] === 0)) {
      values[primaryKeyColumn] = values[dublicate]
      delete values[dublicate]
    }
    const dataColumns = Object.keys(values)
    const queryValues = dataColumns.map(function (value, index) { return '$' + (index + 1) })
    const queryStr = queryUtils.createQuery(Model, 'create', dataColumns, queryValues)
    values = _.values(values)

    client.query(queryStr, values)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

PgClient.prototype.distinct = function distinct (Model, field, options) {
  return new Promise((resolve, reject) => {
    const queryStr = queryUtils.createQuery(Model, 'distinct', options, [field])
    client.query(queryStr)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

PgClient.prototype.save = function save (Model, payload, id) {
  return new Promise((resolve, reject) => {
    // check if Model has dublicates
    const dublicate = modelUtils.checkDublicate(Model)
    const primaryKeyColumn = modelUtils.getPK(Model)

    if (dublicate && payload[dublicate] === id) {
      delete payload[dublicate]
    } else if (dublicate && payload[dublicate] !== id) {
      payload[primaryKeyColumn] = payload[dublicate]
      delete payload[dublicate]
    }

    var data = []
    Object.keys(payload).forEach(function (key) {
      if (typeof payload[key] === 'string' && payload[key]) {
        data.push(`${key} = '${payload[key]}'`)
      } else if (payload[key]) {
        data.push(`${key} = ${payload[key]}`)
      }
    })
    const queryStr = queryUtils.createQuery(Model, 'save', data)
    client.query(queryStr, [id])
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
