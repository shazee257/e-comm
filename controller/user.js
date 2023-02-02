const {
    generateToken,
    generateResponse
} = require('../utils');
const {
    createUser,
    findUser,
    updateUserById
} = require('../models/user');
const userValidation = require('../validation/userValidation');

exports.createNewUser = async (req, res, next) => {
    const { firstName, lastName, mobile, role, email, password } = req.body;

    // Joi validation
    const { error } = userValidation.validate({ firstName, lastName, mobile, role, email, password });
    if (error) {
        return next(new Error(error.details[0].message));
    }

    const userExists = await findUser({ email: req.body.email });
    if (userExists) {
        return next(new Error('User already exists'));
    }

    const user = await createUser(req.body);

    if (user) {
        generateResponse(user, 'User created successfully', res);
    } else {
        next(new Error('Invalid user data'));
    }
};

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    // Joi validation
    const { error } = userValidation.validate({ email, password });
    if (error) {
        return next(new Error(error.details[0].message));
    }

    const user = await findUser({ email: email });

    if (user && await user.matchPassword(password)) {
        const encodedToken = generateToken({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });

        const token = encodedToken;
        // update user token in DB
        const updatedUser = await updateUserById(user._id, { token });
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: process.env.COOKIE_TOKEN_EXPIRATION // 10 minutes in .env
        });

        generateResponse(updatedUser, 'Login successful', res);
    } else {
        next(new Error('Invalid email or password'));
    }
};

exports.getUser = async (req, res, next) => {
    const { email } = req.body;

    // Joi validation
    const { error } = userValidation.validate({ email });
    if (error) {
        return next(new Error(error.details[0].message));
    }

    const user = await findUser({ email: req.body.email });
    if (user) {
        generateResponse(user, 'User found', res);
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

exports.updateUserById = async (req, res, next) => {
    const user = await updateUserById(req.params.id, req.body);
    if (user) {
        generateResponse(user, 'User updated successfully', res);
    } else {
        next(new Error('User not found'));
    }
}
