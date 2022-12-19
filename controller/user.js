const { generateToken } = require('../config/jwtToken');
const {
    createUser,
    findUser,
    updateUserById
} = require('../models/user');

exports.createNewUser = async (req, res, next) => {
    const userExists = await findUser({ email: req.body.email });
    if (userExists) {
        return next(new Error('User already exists'));
    }

    const user = await createUser(req.body);

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
    const user = await findUser({ email: email });

    if (user && await user.matchPassword(password)) {
        console.log("user & password matched =========");

        const encodedToken = generateToken({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });

        const refreshToken = encodedToken;
        await updateUserById(user._id, { refreshToken });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000
        });

        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            refreshToken
        });
    } else {
        next(new Error('Invalid email or password'));
    }
};

exports.getUser = async (req, res, next) => {
    const user = await findUser({ email: req.body.email });
    if (user) {
        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
        });
    } else {
        next(new Error('User not found'));
    }
}