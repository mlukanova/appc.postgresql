'use strict'
const R = require('ramda')
const modelUtils = require('./modelUtils')

module.exports.translateOptionsToQuery = function translateOptionsToQuery (options, modelColumns) {
  var orderQuery = []
  if (options.order) {
    Object.keys(options.order).forEach(function (element) {
      if (options.order[element] === 'ASC' || options.order[element] === 1 || options.order[element] === '1') {
        orderQuery.push(`${element} ASC`)
      } else { orderQuery.push(`${element} DESC`) }
    })
  }

  if (options.unsel) {
    modelColumns = modelColumns.filter((rec) => { return !R.has(rec, options.unsel) })
  }
  if (options.sel) {
    modelColumns = modelColumns.filter((rec) => { return R.has(rec, options.sel) })
  }

  const query = {
    sel: modelColumns,
    where: options.where ? translateWhereToQuery(options.where).join(' AND ') : null,
    order: orderQuery.length > 0 ? orderQuery.join(',') : null,
    skip: options.skip,
    limit: options.limit
  }
  return query
}

/**
 * Translates a "where" object in to the relevant portion of a SQL Query.
 * @param where
 * @param values
 * @returns {string}
 */
function translateWhereToQuery (where) {
  var values = []
  // if the key is 0 or "" the if statement is false so add a check
  Object.keys(where).forEach(function (key) {
    var whereQuery = key
    if (where[key] && !R.isNil(where[key].$like)) {
      values.push(`${whereQuery} LIKE '${where[key].$like}'`)
    } else if (where[key] && !R.isNil(where[key].$lt)) {
      values.push(`${whereQuery} < '${where[key].$lt}'`)
    } else if (where[key] && !R.isNil(where[key].$lte)) {
      values.push(`${whereQuery} <= '${where[key].$lte}'`)
    } else if (where[key] && !R.isNil(where[key].$gt)) {
      values.push(`${whereQuery} > '${where[key].$gt}'`)
    } else if (where[key] && !R.isNil(where[key].$gte)) {
      values.push(`${whereQuery} >= '${where[key].$gte}'`)
    } else if (where[key] && !R.isNil(where[key].$ne)) {
      values.push(`${whereQuery} != '${where[key].$ne}'`)
    } else if (where[key] && !R.isNil(where[key].$eq)) {
      values.push(`${whereQuery} = '${where[key].$eq}'`)
    }
  })

  return values
}

module.exports.createQuery = function createQuery (Model, method, col, values) {
  values = values || []
  col = col || []

  const table = modelUtils.getName(Model)
  const primaryKeyColumn = modelUtils.getPK(Model)

  const query = {
    findAll: () => `SELECT * FROM ${table} ${(primaryKeyColumn ? 'ORDER BY ' + primaryKeyColumn : '')} LIMIT 1000`,
    findByID: () => `SELECT * FROM ${table} WHERE ${primaryKeyColumn} = $1 LIMIT 1000`,

    create: () => `INSERT INTO ${table} (${col}) VALUES (${values.join(',')})`,
    save: () => `UPDATE ${table} SET ${col.join(',')} WHERE ${primaryKeyColumn} = $1`,

    deleteAll: () => `DELETE FROM ${table}`,
    deleteOne: () => `DELETE FROM ${table} WHERE ${primaryKeyColumn} = $1`,

    distinct: () => `SELECT DISTINCT ${values} FROM ${table} ${queryOptions(col)}`,
    count: () => `SELECT COUNT(${(col.sel ? col.sel.join(',') : '*')}) FROM ${table}${queryOptions(col)}`,
    query: () => `SELECT ${(col.sel ? col.sel.join(',') : '*')} FROM ${table}${queryOptions(col)}`
  }
  return query[method]()
}

function queryOptions (options) {
  var queryOptions = ''
  if (options.where) {
    queryOptions += ` WHERE ${options.where}`
  }
  if (options.order) {
    queryOptions += ` ORDER BY ${options.order}`
  }
  if (options.limit) {
    queryOptions += ` LIMIT ${options.limit}`
  }
  if (options.skip) {
    queryOptions += ` OFFSET ${options.skip}`
  }
  return queryOptions
}
