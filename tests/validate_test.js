var {addSchema, validateAgainstSchema} = require("../lib/validate");

var testSchema = {
    "$id": "test",      //The schema's name
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "age": {"type": "number"},
        "childAges": {
            "type": "array",
            "items": {
                "type": "number"
            }
        }
    },
    "additionalProperties": false,
    "required": ["name"]
};

var test_valid = { 
    "name": "Jane True",
    "age": 34,
    "childAges": [2,4]

};
var test_missing_valid = {  //Missing a non-required field
    "name": "Joe Miss",
    "age": 25
};

var test_missing_required = {   //Missing a required field
    "age": 42,
};

var test_additional_properties = {  //Additional Properties present
    "name": "Harry Extra",
    "age": 65,
    "childAges": [25,27,18],
    "address": "1234 Test St."
};
var test_mistyping = {  //Typing doesn't match schema
    "name": "Uknown Steve",
    "age": 22,
    "childAges": ["5", 7]   //<---
};

addSchema(testSchema);

console.log("test_valid: ", (validateAgainstSchema('test', test_valid) === true));
console.log("test_missing_valid: ", (validateAgainstSchema('test', test_missing_valid) === true));
console.log("test_missing_required:", (validateAgainstSchema('test', test_missing_required) === false));
console.log("test_additional_properties: ", (validateAgainstSchema('test', test_additional_properties) === false));
console.log("test_mistyping: ", (validateAgainstSchema('test', test_mistyping) === false))