var Ajv = require('ajv');
var ajv = new Ajv({allErrors: true});

exports.validateAgainstSchema = function(schemaName, data){
//function validateAgainstSchema(schemaName, data){
    return ajv.validate(schemaName, data);
};

exports.addSchema = function(schema){
//function addSchema(schema){
ajv.addSchema(schema);
};