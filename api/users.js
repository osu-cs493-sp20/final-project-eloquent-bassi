const router = require('express').Router();
const { find_hash_by_email, find_id_by_email } = require('../storage/users_db')
const { checkJwt, checkPassword, genToken } = require('../lib/auth');
const { schemaAdd, schemaValidate } = require("../lib/validate");
const { create } = require("../storage/users_db");

router.get('/:id', checkJwt, async (req, res, next) => {//TODO: This
    //TODO: This
    res.status(200).send("TBD")
})

router.post('/login', async (req, res, next) => {//TODO: This
    //FIXME: We might want to do some verification on the email before we query with it
    let email = req.body.email.toString() || null
    let password = req.body.password.toString() || null
    if(email && password){
        try {
            let hash = await find_hash_by_email(email)    
            if(checkPassword(hash,password)){
                let id = find_id_by_email(email)
                let response = { "token": await genToken(id)}
                res.status(200).status(response)
            }
            else{
                res.status(401).status({"Error": "Unauthorized"})
            }
        }
        catch (err){
            res.status().send({"Error": err})
        }
    }
    res.status(400).send({"Error": "Bad request"})
})

router.post('/', async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})

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
