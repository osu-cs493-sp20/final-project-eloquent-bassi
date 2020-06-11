const router = require('express').Router();

const { schemaAdd, schemaValidate } = require("../lib/validate");
const courses_db = require('../storage/courses_db');

const courseSchema = {
  //TODO: Fill this in
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

router.get('/:id/students', async (req, res, next) => {//TODO: This
  try {
  const students = await get_students_by_id(parseInt(req.params.id));
  if (students) {
    res.status(200).send(students);
  } else {
    next();
  }
} catch (err) {
  console.error(err);
  res.status(500).send({
    error: "Unable to fetch students.  Please try again later."
  });
}
})

router.get('/:id/roster', async (req, res, next) => {//TODO: This
    courses_db.get_students_by_id(req.params.id);
    //TODO: do the conversion to CSV here
    res.status(200).send("TBD")
})

//==POST==
router.post('/', async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})

router.post('/:id/students', async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})

//==PATCH==
router.patch('/:id', async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})

//==DELETE==
router.delete('/:id', async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})


module.exports = router;
