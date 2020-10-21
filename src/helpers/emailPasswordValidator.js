const Joi = require('joi');

const RegExpEnum = {
    password: new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$'),
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // eslint-disable-line
    phone: new RegExp('^[+]*[0-9]{5,20}$')
};
const registerValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().trim().regex(RegExpEnum.email).required(),
        password: Joi.string().trim().regex(RegExpEnum.password).required(),
        username: Joi.string().min(6).max(255).required()
    });

return schema.validate(data);
};
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().trim().regex(RegExpEnum.email).required(),
        password: Joi.string().trim().regex(RegExpEnum.password).required()
    });

return schema.validate(data);
};
const emailValidator = (data) => {
    const schema = Joi.object({
        email: Joi.string().trim().regex(RegExpEnum.email).required()
    });

return schema.validate(data);
};
module.exports = {
    registerValidation,
    loginValidation,
    emailValidator
};
