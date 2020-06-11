const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');

const { checkJwt }= require('../lib/auth');
const assignment_db = require('../storage/assignments_db');
const { schemaAdd, schemaValidate } = require('../lib/validate');
const course_db = require('../storage/courses_db');
const user_db = require('../storage/users_db');
const { uploadFile, getFile } = require('../lib/files');

const assignmentSchema = {
    "$id": "createAssignmentBody",
    "type": "object",
    "required": ["course_id", "title", "points", "due"],
    "properties": {
        "course_id": { "type": "integer" },
        "title": { "type": "string" },
        "points": { "type": "integer" },
        "due": { "type": "string" ,
                "format": "date-time"}
    }
};

const submissionSchema = {
    "$id": "createSubmissionBody",
    "type": "object",
    "required": ["student_id", "timestamp", "file"],
    "properties": {
        "assignment_id": { "type": "integer" },
        "student_id": { "type": "integer" },
        "timestamp": { "type": "string",
                       "format": "date-time"
        },
        "file": { "type": "string" }
    }
};

schemaAdd(assignmentSchema);
schemaAdd(submissionSchema);

//Multer stuff to get a file
const upload = multer({
    storage: multer.diskStorage({
      dest: `${__dirname}/uploads`,
      filename: (req, file, callback) => {
          console.log("filename");
        const filename = crypto.pseudoRandomBytes(16).toString("hex");
        const extension = file.mimetype;
        callback(null, `${filename}.${extension}`);
        console.log("filename 2");
      }
    })
  });



//==GET==
router.get('/:id', checkJwt, async (req, res, next) => {
    let id = req.params.id;
    if(id){
        try{
            let assignment = await assignment_db.find_by_id(id);
            if(assignment){
                res.status(200).send(assignment);
            }else{
                res.status(404).send({"Error": "Assignment with id " + id + " not found."});
            }
        }
        catch(err){
            console.log("Error: ", err);
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
    let student_id = req.query.studentId;
    let id = req.params.id;
    let submissions = [];
    try{
         //Admin or instructor of course of assignment with given id
        let assignment = await assignment_db.find_by_id(id);
        if(assignment){
            let course = await course_db.find_by_id(assignment.course_id);
            if(course && (jwt.role === 'admin' || (jwt.role === 'instructor' && jwt.sub === course.instructor_id))){
                //Default page value is 1
                if(!page){
                    page = 1;
                }

                //If studentId was queried and does exist
                if(student_id && user_db.find_by_id(student_id)){
                    submissions = assignment_db.submissions_by_studentId(id, student_id, page);
                }
                //Get submissions just by assignmentId
                else{
                    submissions = assignment_db.submissions_by_id(id, page);
                }

                for(x in submissions){
                    let url = getFile(x.file);
                    x.url = url;
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
            let course = await course_db.find_by_id(body.course_id);
            if(course && (jwt.role === 'admin' || (jwt.role === 'instructor' && jwt.sub === course.instructor_id))){
                let id = await assignment_db.create(body);
                console.log("id value:",id);
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

router.post('/:id/submissions', checkJwt, upload.any(), async (req, res, next) => {
    console.log("Top of submission post");
    let body = req.body;
    let assignment_id = req.params.id;
    let jwt = req.jwt;
    let submission = {
        "assignmentId": body.assignment_id,
        "studentId": body.student_id,
        "timestamp": body.timestamp,
        "file": req.file.filename
    };
    if(body && schemaValidate("createSubmissionBody", sub)){
        try{
            let assignment = assignment_db.find_by_id(assignment_id);

            //Check if they're a student and match the assignment being submitted
            if(jwt.role === "student" && jwt.sub === body.student_id){

                //Upload file then submit submission
                uploadFile(req.file.path, req.file.filename, file.mimetype);
                let submission_id = assignment_db.submit(submission, assignment.course_id);
                res.status(200).send({
                    "id": submission_id
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
            let course = await course_db.find_by_id(body.course_id);
            if(course && (jwt.role === 'admin' || (jwt.role === 'instructor' && jwt.sub === course.instructor_id))){
                if(await assignment_db.update_by_id(id, body)){
                    res.status(200).send("Success");
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
        catch (err){
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
        //Get instructor_d of course of the assignment
        let assignment = await assignment_db.find_by_id(id);
        if(assignment){
            let course = await course_db.find_by_id(assignment.course_id);
            //Is admin or instructor of course
            if(course && (jwt.role === 'admin' || (jwt.role === 'instructor' && jwt.sub === course.instructor_id))){
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
    catch (err) {
        res.status(500).send({"Error": err})
    }
})


module.exports = router;
