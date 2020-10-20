const jwt = require('jsonwebtoken');
const { config } = require('../config');

module.exports = (action) => {
    let accessToken = '';
    let refreshToken = '';

    switch (action) {
        case 'userAuth':
            accessToken = jwt.sign({}, config.JWT_SECRET, { expiresIn: config.ACCESS_TOKEN_LIFETIME });
            refreshToken = jwt.sign({}, config.JWT_REFRESH_SECRET, { expiresIn: config.REFRESH_TOKEN_LIFETIME });
            break;

        case 'userRegister':
            accessToken = jwt.sign({}, config.JWT_CONFIRM_EMAIL_SECRET, { expiresIn: config.JWT_CONFIRM_EMAIL_LIFETIME });
            break;

        case 'forgotPassword':
            accessToken = jwt.sign({}, config.JWT_PASS_RESET_SECRET, { expiresIn: config.JWT_PASS_RESET_LIFETIME });
            break;

        default:
            throw new Error();
    }

    return {
        accessToken,
        refreshToken
    };
};
