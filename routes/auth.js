const router = require('express').Router();
const {
    createNewUser,
    loginUser,
    logout,
} = require('../controller/user');

router.post('/register', createNewUser);
router.post('/login', loginUser);
router.get('/logout', logout);

module.exports = router;