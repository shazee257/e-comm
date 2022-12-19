const router = require('express').Router();
const { createUser, loginUser } = require('../controller/user');

router.post('/register', createUser);
router.post('/login', loginUser);

module.exports = router;