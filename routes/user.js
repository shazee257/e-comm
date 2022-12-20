const router = require('express').Router();
const {
    getUser,
} = require('../controller/user');

router.get('/get-user', getUser);

module.exports = router;