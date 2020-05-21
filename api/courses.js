const router = require('express').Router();

//==GET==
router.get('/', async (req, res, next) => {
    res.status(200).send("TBD")
})

router.get('/:id', async (req, res, next) => {
    res.status(200).send("TBD")
})

router.get('/:id/students', async (req, res, next) => {
    res.status(200).send("TBD")
})

router.get('/:id/roster', async (req, res, next) => {
    res.status(200).send("TBD")
})

//==POST==
router.post('/', async (req, res, next) => {
    res.status(200).send("TBD")
})

router.post('/:id/students', async (req, res, next) => {
    res.status(200).send("TBD")
})

//==PATCH==
router.patch('/:id', async (req, res, next) => {
    res.status(200).send("TBD")
})

//==DELETE==
router.delete('/:id', async (req, res, next) => {
    res.status(200).send("TBD")
})


module.exports = router;