const Joi = require('joi');

const JoiSchema = Joi.object({
    email: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(3).max(30).required(),
    firstName: Joi.string().min(3).max(30),
    lastName: Joi.string().min(3).max(30),
    mobile: Joi.string().min(3).max(30),
    role: Joi.string().min(3).max(30).required(),
});

module.exports = JoiSchema;