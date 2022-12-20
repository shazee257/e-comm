const { generateToken } = require('../utils');
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
        });
    } else {
        next(new Error('Invalid user data'));
    }
};

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await findUser({ email: email });

    if (user && await user.matchPassword(password)) {
        const encodedToken = generateToken({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });

        const token = encodedToken;
        await updateUserById(user._id, { token });
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: process.env.COOKIE_TOKEN_EXPIRATION
        });

        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.mobile,
            token
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

exports.logout = async (req, res, next) => {
    // if token not found in cookie
    const cookie = req.cookies;
    if (!cookie?.token) {
        return res.sendStatus(204); // No content
    }

    // find user By token in DB
    const token = cookie.token;
    const user = await findUser({ token });

    // User is not found in DB
    if (user) {
        await updateUserById(user._id, { token: null });
    }

    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
    });
    return res.sendStatus(204); // No content
}

