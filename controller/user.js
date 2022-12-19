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

exports.logout = async (req, res, next) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        return res.sendStatus(204); // No content
    }
    const refreshToken = cookie.refreshToken;
    const user = await findUser({ refreshToken });
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); // No content
    }
    await updateUserById(user._id, { refreshToken: null });
}

exports.handleRefreshToken = async (req, res, next) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        return res.sendStatus(401); // Unauthorized
    }
    const refreshToken = cookie.refreshToken;
    const user = await findUser({ refreshToken });
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        return next(new Error('No refresh token found in DB / not matched'));
    }
    const encodedToken = generateToken({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    });
    const newRefreshToken = encodedToken;
    await updateUserById(user._id, { refreshToken: newRefreshToken });
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000
    });
    res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        refreshToken: newRefreshToken
    });
}