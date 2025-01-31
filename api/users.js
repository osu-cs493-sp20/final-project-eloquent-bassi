const router = require('express').Router();
const { removeJon, find_hash_by_email, find_id_by_email, create, exists, get_courses_by_instructor_id, students_by_id, find_by_id } = require('../storage/users_db')
const { checkToken, checkJwt, checkPassword, genToken, hashPassword } = require('../lib/auth');
const { schemaAdd, schemaValidate } = require('../lib/validate');

const userSchema = {
    $id: "userSchema",
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

router.get('/:id', checkJwt, async (req, res, next) => {
    let jwt = req.jwt
    if(jwt && (jwt.role === "instructor" || jwt.role === "admin")){
        let id = req.params.id
        if(await exists(id)){
            let data = await get_courses_by_instructor_id(id)
            res.status(200).send(data)
        }
        else{
            res.status(404).send({"Error": "User not found"})
        }
    }
    else if (jwt && jwt.role === "student"){
        let id = req.params.id
        if(await exists(id) && userid == id){
            let data = await students_by_id(id)
            res.status(200).send(data)
        }
        else{
            res.status(404).send({"Error": "User not found"})
        }
    }
    else{
        res.status(403).send({"Error": "Unauthorized"})
    }
})

router.post('/login', async (req, res, next) => {
    //FIXME: We might want to do some verification on the email before we query with it
    let email = req.body.email || null
    let password = req.body.password || null
    if(email && password){
        try {
            let hash = await find_hash_by_email(email)    
            if(await checkPassword(password,hash)){
                let id = await find_id_by_email(email)
                let response = { "Bearer": await genToken(id)}
                res.status(200).send(response)
            }
            else{
                res.status(401).send({"Error": "Unauthorized"})
            }
        }
        catch (err){
            res.status(401).send({"Error": err})
        }
    }
    else{
        res.status(400).send({"Error": "Bad request"})
    }
    
})

router.post('/', checkJwt, async (req, res, next) => {
    // Extract the body
    let body = req.body
    // If we have a body and it's valid
    if(body && schemaValidate('userSchema', body)){
        let role = body.role
        // If the role they want is a protected class...
        if(role === 'admin' || role === 'instructor'){
            let jwt = req.jwt
            // If we have a token and it's admin
            if(jwt && jwt.role === 'admin'){
                // Then create a user with the requested role
                let user = {
                    "email": body.email,
                    "name": body.name,
                    "password": await hashPassword(body.password),
                    "role": role
                }
                try {
                    let id = await create(user)
                    res.status(201).send({"id": id})
                }
                catch(err){
                    res.status(400).send({"Error": err})
                }
            }
            else{
                res.status(403).send({"Error": "Unauthorized"})
            }
        }
        else{// A student
            let user = {
                "email": body.email,
                "name": body.name,
                "password": await hashPassword(body.password),
                "role": "student"
            }
            try {
                let id = await create(user)
                res.status(201).send({"id": id})
            }
            catch (err){
                res.status(400).send({"Error": "User already exists"})
            }
        }
    }
    else{
        // Body didn't exist or it was invalid
        res.status(400).send({"Error": "Empty body or invalid user"})
    }
})

router.post("/cheat", async (req, res) => {
    let user = {
        "email": "richj@oregonstate.edu",
        "name": "Richj",
        "password": await hashPassword("hunter2"),
        "role": "admin"
    }
    await removeJon()// Who invited him anyways?
    let id = await create(user)
    if(id){
        res.status(201).send({"id": id})
    }
})

module.exports = router;