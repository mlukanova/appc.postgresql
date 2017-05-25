module.exports = {
  connectors: {
    'appc.postgresql': {
      connectionPooling: '<OPTIONAL. SET IF YOU WANT TO USE CONNECTION POOLING OR NOT.CAN BE FALSE OR TRUE>',
      connectionLimit: '<OPTIONAL. SET IF YOU WANT TO USE CONNECTION POOLING OR NOT. SET THE LIMIT AS A NUMBER>',

      database: '<MANDATORY. YOUR DATABASE NAME>',
      user: '<MANDATORY. YOUR DATABASE USER>',
      password: '<MANDATORY. YOUR DATABASE PASSWORD>',
      host: '<MANDATORY. YOUR DATABASE HOST.>',
      port: '<MANDATORY. YOUR DATABASE PORT.>',

      generateModels: '<OPTIONAL. ARRAY OF MODEL NAMES THAT NEED TO BE GENERATED>',
      modelAutogen: true,
      generateModelsFromSchema: true,
      skipModelNamespace: false,
      modelNamespace: '<OPTIONAL. OVERRIDES THE DEFAULT NAMESPACE VALUE WHICH IS SET TO THE NAME OF THE CONNECTOR.>'
    }
  }
}
