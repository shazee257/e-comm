const router = require('express').Router();
const {
    getUser,
    updateUserById,
} = require('../controller/user');

router.get('/get-user', getUser);
router.put('/update/:id', updateUserById);


module.exports = router;