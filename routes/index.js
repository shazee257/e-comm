const router = require('express').Router();

const userApi = require('./user');

router.use('/users', userApi);

module.exports = router;