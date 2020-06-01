var Ajv = require('ajv');
var ajv = new Ajv({allErrors: true});

/******
 * Returns if some data matches a schema
 * @param {string} schemaName
 * @param {JSON object} data
 * @return {boolean}
 */
exports.validateAgainstSchema = function(schemaName, data){
    return ajv.validate(schemaName, data);
};

/****
 * Adds a JSON schema to the AJV cache
 * @param {JSON Schema} schema
 */
exports.addSchema = function(schema){
    ajv.addSchema(schema);
};