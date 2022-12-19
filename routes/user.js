const router = require('express').Router();
const {
    createNewUser,
    loginUser,
    getUser,
} = require('../controller/user');
const { isAuth } = require('../middlewares');

router.post('/register', createNewUser);
router.post('/login', loginUser);
router.get('/get-user', isAuth, getUser);

module.exports = router;