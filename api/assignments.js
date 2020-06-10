const router = require('express').Router();
const { create, find_by_id } = require('../storage/assignments_db');
const { schemaAdd, schemaValidate } = require('../lib/validate');

const assignmentSchema = {
    "$id": "createAssignmentBody",
    "type": "object",
    "required": ["courseId", "title", "points", "due"],
    "properties": {
        "courseId": { "type": "string|integer" },
        "title": { "type": "string" },
        "points": { "type": "integer" },
        "due": { "type": "string" }
    }
};

schemaAdd(assignmentSchema);

//==GET==
router.get('/:id', async (req, res, next) => {
    let id = req.body.id;
    if(id){
        try{
            let assignment = await find_by_id(id);
            if(assignment){ 
                res.status(200).send(assignment);
            }else{
                res.status(404).send({error: "Assignment with id ${id} not found."});
            }
        }
        catch(err){
            res.status().send({"Error": err})
        }
    }
    res.status(400).send({"Error": "Bad request"})
})

router.get('/:id/submissions', async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})

//==POST==
router.post('/', async (req, res, next) => {
    if(req.body && schemaValidate("createAssignmentBody", req.body)){
        try{
            let id = create();
            res.status(201).send({
                "id": id
            })
        }catch(err){
            res.status().send({"Error": err})
        }
    }
    res.status(400).send({"Error": "Bad request"})

})

router.post('/:id/submissions', async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})

//==PATCH==
router.patch('/:id', async (req, res, next) => {//TODO: This
    if(){
        try{

        }catch(err){
            
        }
    }
})

//==DELETE==
router.delete('/:id', async (req, res, next) => {//TODO: This
    if(){
        try{

        }catch(err){
            
        }
    }
})


module.exports = router;