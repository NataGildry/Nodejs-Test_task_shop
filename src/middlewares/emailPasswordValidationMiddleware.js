const {Joi} = require('joi');
const emailPasswordValidator = require('../helpers');

module.exports = (req, res, next) => {
    const {error} = Joi.validate(req.body, emailPasswordValidator);

    if (error) {
        return next(new Error(error.details[0].message));
    }

    return next();
};
