var Ajv = require('ajv');
var ajv = new Ajv({allErrors: true});

const testSchema = {
    "$id": 'test',
    "type": 'object',
    "properties": {
        "name": {"type": "string"},
        "streetNumber": {"type": "number"},
        "streetName": {"type": "string"},
    },
    "additionalProperties": false,   //Including properties not defined will be invalid
    "required": ["name"]
};
const testData = {
    "name": "Johnny Test",
    "streetNumber": 1234,
    "streetName": "Test St."
};

exports.validateAgainstSchema = function(schemaName, data){
    return ajv.validate(schemaName, data);
};

exports.addSchema = function(schema){
    return ajv.addSchema(schema, schemaName);
};