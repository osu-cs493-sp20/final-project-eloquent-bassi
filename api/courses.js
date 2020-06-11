const router = require('express').Router();
const { checkJwt } = require('../lib/auth');

const { schemaAdd, schemaValidate } = require("../lib/validate");
const courses_db = require('../storage/courses_db');

const courseSchema = {
  "$id": "createCourseBody",
  "type": "object",
  "required": ["subject","number","title","term","instructor_id"],
  "properties": {
    "subject":{"type": "string"},
    "number":{"type": "integer"},
    "title":{"type": "string"},
    "term":{"type": "string"},
    "instructor_id": {"type": "integer"},
    "description": {"type": "string"}
  }
}

schemaAdd(courseSchema);

//==GET==
router.get('/', async (req, res, next) => {
  try {
      const coursePage = await courses_db.get_page(parseInt(req.query.page) || 1);
      coursePage.links = {};
      if (coursePage.page < coursePage.totalPages) {
        coursePage.links.nextPage = `/courses?page=${coursePage.page + 1}`;
        coursePage.links.lastPage = `/courses?page=${coursePage.totalPages}`;
      }
      if (coursePage.page > 1) {
        coursePage.links.prevPage = `/courses?page=${coursePage.page - 1}`;
        coursePage.links.firstPage = '/courses?page=1';
      }
      res.status(200).send(coursePage);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching courses list.  Please try again later."
    });
  }
});

router.get('/:id', async (req, res, next) => {
  try {
  const course = await courses_db.find_by_id(parseInt(req.params.id));
  if (course) {
    res.status(200).send(course);
  } else {
    next();
  }
} catch (err) {
  console.error(err);
  res.status(500).send({
    error: "Unable to fetch course.  Please try again later."
  });
}
})

router.get('/:id/students', checkJwt, async (req, res, next) => {
  try{
    let course = await courses_db.find_by_id(body.courseId);
    if(course && (jwt.role === 'admin' || (jwt.role === 'instructor' && jwt.sub === course.instructorId))){
      const students = await get_students_by_id(parseInt(req.params.id));
      if (students) {
        res.status(200).send(students);
      } else {
        next();
      }
    } else {
        res.status(403).send({"Error": "Unauthorized request"})
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch students.  Please try again later."
    });
  }
});

//WARNING: I think this works, but it hasn't been tested, and if you have a better solution, go for it
router.get('/:id/roster', checkJwt, async (req, res, next) => {
  let body = req.body
  let id = body.id;
  let jwt = req.jwt;
  try{
    let course = await courses_db.find_by_id(body.courseId);
    if(course && (jwt.role === 'admin' || (jwt.role === 'instructor' && jwt.sub === course.instructorId))){
      const roster = await courses_db.get_students_by_id(req.params.id);
      var rosterCSV = convertToCSV(roster);
      res.attachment(`roster_course_${res.params.id}.csv`);
      res.status(200).send(rosterCSV);
    } else {
        res.status(403).send({"Error": "Unauthorized request"})
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error retreving roster.  Please try again later."
    });
  }
})

//==POST==
router.post('/', checkJwt, async (req, res, next) => {
  let body = req.body
  let id = body.id;
  let jwt = req.jwt;
  // FIXME: Schema 
  if (true) {//schemaValidate(req.body, CourseSchema)
    try{
      let course = await courses_db.find_by_id(body.courseId);
      if(course && (jwt.role === 'admin' || (jwt.role === 'instructor' && jwt.sub === course.instructorId))){
        const id = await courses_db.create(req.body);
        res.status(201).send({
          id: id,
          links: {
            course: `/courses/${id}`
          }
        });
      } else {
        res.status(403).send({"Error": "Unauthorized request"})
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error inserting course into DB.  Please try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid course object."
    });
  }
});

router.post('/:id/students', checkJwt, async (req, res, next) => {
  let body = req.body
  let id = body.id;
  let jwt = req.jwt;
  try{
    let course = await courses_db.find_by_id(body.courseId);
    if(course && (jwt.role === 'admin' || (jwt.role === 'instructor' && jwt.sub === course.instructorId))){
      if (req.body.add) {
        req.body.add.forEach(async(item, i) => {
          const result = await courses_db.enroll_by_id(req.params.id, parseInt(i));
        });
      }
      if (req.body.remove) {
        req.body.remove.forEach( async(item, i) => {
          const result = await courses_db.remove_by_id(req.params.id, parseInt(i));
        });
      }
      res.status(200).send("Success");
    } else {
        res.status(403).send({"Error": "Unauthorized request"})
    }
  } catch (err) {
    res.status(400).send({
      error: "Request body contains at least one invalid user."
    });
  }
});

//==PATCH==
router.patch('/:id', checkJwt, async (req, res, next) => {
  let body = req.body
  let id = body.id;
  let jwt = req.jwt;
  if(body && id && schemaValidate("createCourseBody", body)){
    //admin or instructor of the course
        try{
            let course = await courses_db.find_by_id(body.courseId);
            if(course && (jwt.role === 'admin' || (jwt.role === 'instructor' && jwt.sub === course.instructorId))){
                if(await courses_db.update_by_id(id, body)){
                    res.status(200);
                }
                else{
                    res.status(404).send({"Error": "Course with id " + id + " not found."});
                }
            }
            //Not an admin or the instructor
            else{
                res.status(403).send({"Error": "Unauthorized request"})
            }
        } catch (err) {
            res.status(500).send({"Error": err})
        }
    }
    else{
        res.status(400).send({"Error": "Invalid body"})
    }
});

//==DELETE==
router.delete('/:id', checkJwt, async (req, res, next) => {
  let body = req.body
  let id = body.id;
  let jwt = req.jwt;
  try {
    let course = await courses_db.find_by_id(body.courseId);
    if(course && (jwt.role === 'admin')){
      const deleteSuccessful = await courses_db.remove_by_id(parseInt(req.params.id));
      if (deleteSuccessful) {
        res.status(204).end();
      } else {
        next();
      }
    } else {
        res.status(403).send({"Error": "Unauthorized request"})
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to delete course.  Please try again later."
    });
  }
});

function convertToCSV(arr) {
  const array = [Object.keys(arr[0])].concat(arr);

  return array.map(it => {
    return Object.values(it).toString()
  }).join('\n')
}

module.exports = router;
