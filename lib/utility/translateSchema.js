'use strict'
const R = require('ramda')

var schema = {}
/**
 * Transforms the database schema to JSON objects
 * @param {Object} connector The Arrow connector
 * @param {Object} src The schema from the database
 * @returns {Object} JSON object containing description of the schema
 */

module.exports = function translateSchema (connector, src) {
  src.rows.forEach(function (row) {
    attachField(connector, row)
  })
  return schema
}

/**
 * Attaches the columns to the schema
 * @param {Object} connector
 * @param {Array} row Description of a column in the database
 */
function attachField (connector, row) {
  var table = row.table_name
  var fieldName = row.column_name

  if (!row.indisprimary) {
    var field = {
      type: convertDataTypeToJSType(row.data_type),
      required: row.is_nullable !== 'false',
      default: row.column_default
    }
    schema = R.assocPath([table, 'fields', fieldName], field, schema)
  } else {
    // add more checks
    if (!row.column_default) {
      generateDublicate(row)
    }
    schema = R.assocPath([table, 'metadata', 'primarykey'], fieldName, schema)
  }
  schema = R.assocPath([table, 'connector'], connector, schema)
}

/**
 * Converts the PostgreSQL types to Arrow types
 * @param {string} dataType
 * @returns {string} String containing the type
 */
function convertDataTypeToJSType (dataType) {
  switch (dataType) {
    case 'tinyint':
    case 'smallint':
    case 'mediumint':
    case 'bigint':
    case 'int':
    case 'integer':
    case 'float':
    case 'bit':
    case 'double':
    case 'binary':
    case 'year':
      return 'number'
    case 'date':
    case 'datetime':
    case 'time':
      return 'date'
    default:
      return 'string'
  }
}

/**
 * Adds additional fiels for tables that don't have auto generated
 * primary keys
 * @param {} row
 */
function generateDublicate (row) {
  var table = row.table_name
  var dublicateName = row.column_name + '_ID'
  var dublicate = {
    type: convertDataTypeToJSType(row.data_type),
    required: false,
    default: row.column_default
  }
  schema = R.assocPath([table, 'fields', dublicateName], dublicate, schema)
  schema = R.assocPath([table, 'metadata', 'appc.postgresql', 'primarykey'], dublicateName, schema)
}
