const { verify } = require('jsonwebtoken');

exports.notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

exports.errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err?.message,
        stack: err?.stack,
    });
}

exports.isAuth = async (req, res, next) => {
    // get token from cookie
    const token = req.cookies.refreshToken;
    if (token) {
        const decoded = verify(token, process.env.JWT_SECRET);
        req.user = { ...decoded };
        next();
    } else {
        next(new Error('Not authorized, token failed'));
    }
}