const router = require('express').Router();
const {
    createNewUser,
    getUser,
    loginUser,
    logout,
    handleRefreshToken,
} = require('../controller/user');
const { isAuth } = require('../middlewares');

router.post('/register', createNewUser);
router.post('/login', loginUser);
router.get('/get-user', isAuth, getUser);
router.get('/logout', logout);
router.get('/refresh-token', handleRefreshToken);

module.exports = router;