const router = require("express").Router();
const {
  hashPassword,
  checkJwt,
  checkPassword,
  genToken
} = require("../lib/auth");
const router = require("express").Router();
const { schemaAdd, schemaValidate } = require("../lib/validate");
const {
  create,
  findById,
  find_hash_by_email,
  find_id_by_email
} = require("../storage/users_db");
const {
  findByStudentId,
  findByInstructorId
} = require("../storage/courses_db");

router.get("/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  const user = await findById(id);

  if (!user) {
    res.status(404).send({ error: `user with id ${id} not found` });
    return;
  }

  if (!req.jwt || req.jwt.sub !== id) {
    res.status(403).send({ error: "not authorized to access this user" });
    return;
  }

  let courses = [];

  if (user.role == "student") {
    courses = await findByStudentId(user.id);
  } else if (user.role == "instructor") {
    courses = await findByInstructorId(user.id);
  }

  const courseIds = courses.map(course => course.id);

  res.status(200).send({
    name: user.name,
    role: user.role,
    email: user.email,
    courses: courseIds
  });
});

router.post("/login", async (req, res, next) => {
  //TODO: This
  //FIXME: We might want to do some verification on the email before we query with it
  let email = req.body.email.toString() || null;
  let password = req.body.password.toString() || null;
  if (email && password) {
    try {
      let hash = await find_hash_by_email(email);
      if (checkPassword(hash, password)) {
        let id = find_id_by_email(email);
        let response = { token: await genToken(id) };
        res.status(200).status(response);
      } else {
        res.status(401).status({ Error: "Unauthorized" });
      }
    } catch (err) {
      res.status().send({ Error: err });
    }
  }
  res.status(400).send({ Error: "Bad request" });
});

router.post("/", async (req, res, next) => {
  //TODO: This
  res.status(200).send("TBD");
});

const userSchema = {
  $id: "createUserBody",
  type: "object",
  required: ["name", "email", "password", "role"],
  properties: {
    name: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    role: {
      type: "string",
      enum: ["student", "instructor", "admin"]
    }
  }
};

schemaAdd(userSchema);

router.post("/", async (req, res, next) => {
  if (!schemaValidate("createUserBody", req.body)) {
    res.status(400).send({
      error: "invalid body"
    });
    return;
  }

  console.log(!req.jwt || req.jwt.role != "admin");
  if (req.body.role == "admin" && (!req.jwt || req.jwt.role != "admin")) {
    res.status(403).send({
      error: "unauthorized to create admin user"
    });
    return;
  }

  const user = {
    name: req.body.name,
    email: req.body.email,
    password: await hashPassword(req.body.password),
    role: req.body.role
  };

  const id = await create(user);
  res.status(201).send({ id });
});

module.exports = router;
