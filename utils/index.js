const jwt = require('jsonwebtoken');

exports.generateToken = (payload) => {
    return jwt.sign({ ...payload }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
}

exports.generateResponse = (data, message, res) => {
    return res.send({
        data,
        message
    });
}