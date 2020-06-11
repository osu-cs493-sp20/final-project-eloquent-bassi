const router = require('express').Router();

const { checkJwt }= require('../lib/auth');
const assignment_db = require('../storage/assignments_db');
const { schemaAdd, schemaValidate } = require('../lib/validate');
const course_db = require('../storage/courses_db');
const user_db = require('../storage/users_db');
const { uploadFile, getFile } = require('../lib/files');

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

const submissionSchema = {
    "$id": "createSubmissionBody",
    "type": "object",
    "required": ["studentId", "timestamp", "file"],
    "properties": {
        "assignmentId": { "type": "integer" },
        "studentId": { "type": "integer" },
        "timestamp": { "type": "string",
                       "format": "date-time"                    
        },
        "file": { "type": "string" }
    }    
};

schemaAdd(assignmentSchema);
schemaAdd(submissionSchema);

//==GET==
router.get('/:id', checkJwt, async (req, res, next) => {
    let id = req.params.id;
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
            res.status(500).send({"Error": err})
        }
    }
    else{
        res.status(400).send({"Error": "Bad request"})
    }
});

router.get('/:id/submissions', checkJwt, async (req, res, next) => {//TODO: This
    //Requires page (query), studentid(query), id (path)
    let page = req.query.page;
    let studentId = req.query.studentId;
    let id = req.params.id;
    let submissions = [];
    try{
         //Admin or instructor of course of assignment with given id
        let assignment = await assignment_db.find_by_id(id);
        if(assignment){
            let course = await course_db.find_by_id(assignment.courseId);
            if(course && (jwt.role === 'admin' || (jwt.role === 'instructor' && jwt.sub === course.instructorId))){
                //Default page value is 1
                if(!page){
                    page = 1;
                }

                //If studentId was queried and does exist
                if(studentId && user_db.find_by_id(studentId)){
                    submissions = assignment_db.submissions_by_studentId(id, studentId, page);
                }
                //Get submissions just by assignmentId
                else{
                    submissions = assignment_db.submissions_by_id(id, page);
                }

                res.status(200).send({
                    "page": page,
                    "submissions": submissions
                })
            }
            else{
                res.status(403).send({"Error": "Unauthorized request"});
            }
        }
        else{
            res.status(404).send({"Error": "Assignment with id " + id + " not found."});
        }
    }
    catch(err){
        res.status(500).send({"Error": err})
    }

})

//==POST==
router.post('/', checkJwt, async (req, res, next) => {
    let body = req.body;
    let jwt = req.jwt;
    if(body && schemaValidate("createAssignmentBody", body)){
        //admin or instructor of the course
        try{
            let course = await course_db.find_by_id(body.courseId);
            if(course && (jwt.role === 'admin' || (jwt.role === 'instructor' && jwt.sub === course.instructorId))){
                let id = assignment_db.create(body);
                res.status(201).send({
                    "id": id
                })
            }
            //Not an admin or the instructor
            else{
                res.status(403).send({"Error": "Unauthorized request"})
            }
        }
        catch(err){
            res.status(500).send({"Error": err})
        }
    }
    else{
        res.status(400).send({"Error": "Invalid body"}) 
    }
})

router.post('/:id/submissions', checkJwt, async (req, res, next) => {
    let body = req.body;
    let assignmentId = req.params.id;
    let jwt = req.jwt;
    if(body && schemaValidate("createSubmissionBody", body)){
        try{
            let assignment = assignment_db.find_by_id(assignmentId);

            //Check if they're a student and match the assignment being submitted
            if(jwt.role === "student" && jwt.sub === body.studentId){

                let submissionId = assignment_db.submit(body, assignmentId);
                res.status(200).send({
                    "id": submissionId
                })
            }
            else{
                res.status(403).send({"Error": "Unauthorized request"})
            }
        }
        catch(err){
            res.status(500).send({"Error": err})
        }
    }
    else{
        res.status(400).send({"Error": "Invalid body"}) 
    }

})

//==PATCH==
router.patch('/:id', checkJwt, async (req, res, next) => {
    let body = req.body
    let id = req.params.id;
    let jwt = req.jwt;
    if(body && id && schemaValidate("createAssignmentBody", body)){
        //admin or instructor of the course
        try{
            let course = await course_db.find_by_id(body.courseId);
            if(course && (jwt.role === 'admin' || (jwt.role === 'instructor' && jwt.sub === course.instructorId))){
                //TODO: change assignemnt_db.update_by_id parameters to take a body
                if(await assignment_db.update_by_id(id, body)){
                    res.status(200);
                }
                else{
                    res.status(404).send({"Error": "Assignment with id " + id + " not found."});
                }

            }
            //Not an admin or the instructor
            else{
                res.status(403).send({"Error": "Unauthorized request"})
            }
        }
        catch{
            res.status(500).send({"Error": err})
        }
    }
    else{
        res.status(400).send({"Error": "Invalid body"}) 
    }
})

//==DELETE==
router.delete('/:id', checkJwt, async (req, res, next) => {
    let id = req.params.id;
    try{
        //Get instructorId of course of the assignment
        let assignment = await assignment_db.find_by_id(id);
        if(assignment){
            let course = await course_db.find_by_id(assignment.courseId);
            //Is admin or instructor of course
            if(course && (jwt.role === 'admin' || (jwt.role === 'instructor' && jwt.sub === course.instructorId))){
                await assignment_db.remove_by_id(id);   //Already checked if assignment exists, so just delete it
                res.status(204);
            }
            //Not insrtuctor or admin
            else{
                res.status(403).send({"Error": "Unauthorized request"})
            }
        }
        else{
            res.status(404).send({"Error": "Assignment with id " + id + " not found."});
        }
    }
    catch{
        res.status(500).send({"Error": err})
    }
})


module.exports = router;
