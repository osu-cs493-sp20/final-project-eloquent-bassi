var Ajv = require('ajv');
var ajv = new Ajv({allErrors: true});

/******
 * Typedef of a JSON schema.
 * @typedef {Object} JSON_schema
 * @property {string} $id - The name to identify a schema by.
 * @property {string} type - Data type the schema is. If it contains multiple properties
 *                           of varying types, use the type "object".
 * @property {JSON} properties - JSON of properties of the entity defined by the schema.
 * @property {boolean} additionalProperties - True if properties other than defined in
 *                                            the proprties field above are allowed in
 *                                            an instance an object using the schema.
 * @property {string[]} required - Array of properties that must be present to be deemed
 *                                 a valid object using the schema.
 ******/

/******
 * Returns if some data matches a schema
 * @param {string} schemaName
 * @param {JSON} data
 * @return {boolean}
 ******/
exports.schemaValidate = function(schemaName, data){
    return ajv.validate(schemaName, data);
};

/******
 * Adds a JSON schema to the AJV cache.
 * @param {JSON_schema} schema
 ******/
exports.schemaAdd = function(schema){
    ajv.addSchema(schema);
};
