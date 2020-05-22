const router = require('express').Router();

//router.use('/XYZ', require('./XYZ'));//TODO: This
router.use('/assignments', require('./assignments'));
router.use('/courses', require('./courses'));
router.use('/users', require('./users'));

module.exports = router;
