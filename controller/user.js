const UserModel = require('../models/user');
const { generateToken } = require('../config/jwtToken');

exports.createUser = async (req, res, next) => {
    const { firstName, lastName, email, password, mobile } = req.body;

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
        return next(new Error('User already exists'));
    }

    const user = await UserModel.create({
        firstName,
        lastName,
        email,
        password,
        mobile
    });

    if (user) {
        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            token: generateToken(user._id)
        });
    } else {
        next(new Error('Invalid user data'));
    }
};

exports.loginUser = async (req, res, next) => {
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
}
