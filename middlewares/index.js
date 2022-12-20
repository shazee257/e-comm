const { verify, sign } = require('jsonwebtoken');

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
    const cookie = req.cookies;
    const token = cookie?.token;
    if (!token) {
        return next(new Error('Authorization failed!'));
    }

    verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            next(new Error("Invalid Token"))
        }
        else {
            const tokenIssuedTime = decoded.iat * 1000;
            const nowTime = new Date().getTime();
            const tokenAge = nowTime - tokenIssuedTime;
            console.log("previous req hit since: (ms) ", tokenAge);

            if (tokenAge > process.env.COOKIE_TOKEN_EXPIRATION) {
                next(new Error('Token is expired'));
            } else {
                // issue new Token
                const refreshToken = sign({
                    _id: decoded._id,
                    firstName: decoded.firstName,
                    lastName: decoded.lastName,
                    email: decoded.email,
                }, process.env.JWT_SECRET);

                res.cookie('token', refreshToken, {
                    maxAge: process.env.COOKIE_TOKEN_EXPIRATION,
                    httpOnly: true
                });

                req.user = { ...decoded };
                next();
            }
        }
    });




}