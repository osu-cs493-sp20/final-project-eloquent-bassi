const router = require('express').Router();
const checkJwt = require('../lib/auth');

//==GET==
router.get('/:id', async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})

router.get('/:id/submissions', checkJwt, async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})

//==POST==
router.post('/', checkJwt, async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})

router.post('/:id/submissions', checkJwt, async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})

//==PATCH==
router.patch('/:id', checkJwt, async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})

//==DELETE==
router.delete('/:id', checkJwt, async (req, res, next) => {//TODO: This
    res.status(200).send("TBD")
})


module.exports = router;