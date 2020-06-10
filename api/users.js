const router = require("express").Router();

const { schemaAdd, schemaValidate } = require("../lib/validate");
const { create } = require("../storage/users_db");

router.get("/:id", async (req, res, next) => {
  //TODO: This
  res.status(200).send("TBD");
});

router.post("/login", async (req, res, next) => {
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

  const id = await create(req.body);
  res.status(201).send({ id });
});

module.exports = router;
