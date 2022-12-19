const router = require('express').Router();

const authApi = require('./auth');

router.use('/auth', authApi);

module.exports = router;