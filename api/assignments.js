const router = require('express').Router();
const assignment_db = require('../storage/assignments_db');
const { schemaAdd, schemaValidate } = require('../lib/validate');
const course_db = require('../storage/courses_db');

const assignmentSchema = {
    "$id": "createAssignmentBody",
    "type": "object",
    "required": ["courseId", "title", "points", "due"],
    "properties": {
        "courseId": { "type": "integer" },
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
            let assignment = await assigment_db.find_by_id(id);
            if(assignment){ 
                res.status(200).send(assignment);
            }else{
                res.status(404).send({"Error": "Assignment with id " + id + " not found."});
            }
        }
        catch(err){
            res.status().send({"Error": err})
        }
    }
    else{
        res.status(400).send({"Error": "Bad request"})
    }
})

router.get('/:id/submissions', async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})

//==POST==
router.post('/', async (req, res, next) => {
    let body = req.body;
    let jwt = req.jwt;
    if(body && schemaValidate("createAssignmentBody", body)){
        //admin or instructor of the course
        let course = await course_db.find_by_id(body.courseId);
        if(course && (jwt.role === 'admin' || (jwt.role === 'instructor' && jwt.sub === course.instructorId))){
            try{
                let id = assignment_db.create();
                res.status(201).send({
                    "id": id
                })
            }catch(err){
                res.status().send({"Error": err})
            }
        }
        //Not an admin or the instructor
        else{
            res.status(403).send({"Error": "Unauthorized request"})
        }
    }
    else{
        res.status(400).send({"Error": "Invalid body"}) 
    }
})

router.post('/:id/submissions', async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})

//==PATCH==
router.patch('/:id', async (req, res, next) => {
    let body = req.body
    let id = body.id;
    let jwt = req.jwt;
    if(body && id && schemaValidate("createAssignmentBody", body)){
        //admin or instructor of the course
        let course = await course_db.find_by_id(body.courseId);
        if(course && (jwt.role === 'admin' || (jwt.role === 'instructor' && jwt.sub === course.instructorId))){
            try{
                //TODO: change assignemnt_db.update_by_id parameters to take a body
                if(await assignment_db.update_by_id(id, body)){
                    res.status(200);
                }
                else{
                    res.status(404).send({"Error": "Assignment with id " + id + " not found."});
                }

            }
            catch(err){
                res.status().send({"Error": err})
            }
        }
        //Not an admin or the instructor
        else{
            res.status(403).send({"Error": "Unauthorized request"})
        }
    }
    else{
        res.status(400).send({"Error": "Invalid body"}) 
    }
})

//==DELETE==
router.delete('/:id', async (req, res, next) => {//TODO: This
    let id = req.params.id;
    if(id){
        //Get instructorId of course of the assignment
        let assignment = await assignment_db.find_by_id(id);
        if(assignment){
            let course = await course_db.find_by_id(assignment.courseId);
            //Is admin or instructor of course
            if(course && (jwt.role === 'admin' || (jwt.role === 'instructor' && jwt.sub === course.instructorId))){
                try{
                    await assignment_db.remove_by_id(id);   //Alrady checked if assignment exists, so just delete
                    res.status(204);
                }
                catch(err){
                    res.status().send({"Error": err})
                }
            }
            else{
            res.status(403).send({"Error": "Unauthorized request"})
            }
        }
        else{
            res.status(404).send({"Error": "Assignment with id " + id + " not found."});
        }
    }
})


module.exports = router;