'use strict'

/**
 * Gets Model real name
 * @param {Object} Model
 * @returns
 */

module.exports.getName = function (Model) {
  var parent = Model
  while (parent._parent && parent._parent.name) {
    parent = parent._parent
  }
  var modelName = parent.name || Model._supermodel || Model.name
  modelName = modelName.split('/').pop()
  return modelName
}

/**
 * Check if model has dublicate field for the primary key
 * @param {object} modelName
 */
module.exports.checkDublicate = function (Model) {
  return Model.metadata && Model.metadata['appc.postgresql'] ? Model.metadata['appc.postgresql'].primarykey : false
}

module.exports.getTableColumns = function (Model) {
  const dublicate = this.checkDublicate(Model)
  const primarykey = this.getPK(Model)
  const columns = Object.keys(Model.fields).filter(function (prop) {
    return prop !== dublicate
  })
  columns.push(primarykey)
  return columns
}

module.exports.getPKValue = function getPKValue (Model, item) {
  return typeof item === 'object' && this.getPK(Model) ? item[this.getPK(Model)] : item
}

module.exports.getPK = function getPK (Model) {
  return Model.metadata ? Model.metadata.primarykey : false
}

module.exports.getInstance = function getInstance (Model, item) {
  const instance = Model.instance(item, true)
  instance.setPrimaryKey(this.getPKValue(Model, item))
  const dublicate = this.checkDublicate(Model)
  if (dublicate && instance.getPrimaryKey()) {
    instance[dublicate] = instance.getPrimaryKey()
  }
  return instance
}
