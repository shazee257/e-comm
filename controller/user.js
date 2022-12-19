const UserModel = require('../models/user');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwtToken');

const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await UserModel.findOne({ email });
    if (!findUser) {
        const newUser = await UserModel.create(req.body);
        res.json(newUser);
    } else {
        throw new Error('User already exists');
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const findUser = await UserModel.findOne({ email });
    if (findUser && (await findUser.matchPassword(password))) {
        console.log("findUser", findUser)
        res.json({
            _id: findUser._id,
            firstName: findUser.firstName,
            lastName: findUser.lastName,
            email: findUser.email,
            mobile: findUser.mobile,
            token: generateToken(findUser._id)
        })


    } else {
        throw new Error('Invalid email or password');
    }

})


module.exports = { createUser, loginUser };


