const jwt = require('jsonwebtoken');
const {config} = require('../config');

module.exports = (action) => {
    let access_token = '';
    let refresh_token = '';

    switch (action) {
        case 'user_auth':
            access_token = jwt.sign({}, config.JWT_SECRET, {expiresIn: config.ACCESS_TOKEN_LIFETIME});
            refresh_token = jwt.sign({}, config.JWT_REFRESH_SECRET, {expiresIn: config.REFRESH_TOKEN_LIFETIME});
            break;

        case 'user_register':
            access_token = jwt.sign({}, config.JWT_CONFIRM_EMAIL_SECRET, {expiresIn: config.JWT_CONFIRM_EMAIL_LIFETIME});
            break;

        case 'forgot_password':
            access_token = jwt.sign({}, config.JWT_PASS_RESET_SECRET, {expiresIn: config.JWT_PASS_RESET_LIFETIME});
            break;

        default:
            throw new Error;
    }

    return {
        access_token,
        refresh_token
    };
};
