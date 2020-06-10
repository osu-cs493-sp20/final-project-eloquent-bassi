const router = require('express').Router();
const checkJwt = require('../lib/auth');

router.get('/:id', checkJwt, async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})

router.post('/login', async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})

router.post('/', async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})

module.exports = router;