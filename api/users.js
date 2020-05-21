const router = require('express').Router();

router.get('/:id', async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})

router.post('/login', async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})

router.post('/users', async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})

module.exports = router;