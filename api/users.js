const router = require('express').Router();
const { find_hash_by_email, find_id_by_email } = require('../storage/users_db')
const { checkJwt, checkPassword, genToken } = require('../lib/auth');

router.get('/:id', checkJwt, async (req, res, next) => {//TODO: This

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

module.exports = router;