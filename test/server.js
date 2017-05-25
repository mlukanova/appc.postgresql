'use strict'

const Arrow = require('arrow')

module.exports = function (options) {
  return new Promise((resolve, reject) => {
    options = options || {}
    const arrow = new Arrow({}, true)
    const connector = arrow.getConnector('appc.postgresql')

    if (options.generateTestModels !== false) {
      // Create test model - Categories
      arrow.addModel(Arrow.createModel('Categories', {
        name: 'Categories',
        connector,
        fields: {
          Description: {
            type: 'string',
            required: false
          },
          Name: {
            type: 'string',
            required: false
          },
          Products: {
            type: 'array',
            required: false,
            model: 'Product'
          }
        },
        metadata: {
          primarykey: 'id'
        }
      }))

      // Create test model - Products
      arrow.addModel(Arrow.createModel('Products', {
        name: 'Products',
        connector,
        fields: {
          CategoryId: {
            type: 'string',
            required: true
          },
          Discontinued: {
            type: 'boolean',
            required: false
          },
          Name: {
            type: 'string',
            required: false
          },
          QuantityPerUnit: {
            type: 'string',
            required: false
          },
          UnitPrice: {
            type: 'number',
            required: false
          },
          Category: {
            type: 'string',
            required: false,
            model: 'Category'
          },
          id_ID: {
            type: 'string',
            required: false
          }
        },
        metadata: {
          primarykey: 'id',
          'appc.postgresql': {
            primarykey: 'id_ID'
          }
        }
      }))
    }

    // Return the arrow instance
    resolve(arrow)
  })
}
