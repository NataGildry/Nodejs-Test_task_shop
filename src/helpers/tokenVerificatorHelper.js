const jwt = require('jsonwebtoken');
const { config } = require('../config');

module.exports = async (action, token) => {
    try {
        let isValid;

        switch (action) {
            case 'userAuth':
                isValid = await jwt.verify(token, config.JWT_SECRET);
                break;

            case 'userRegister':
                isValid = await jwt.verify(token, config.JWT_CONFIRM_EMAIL_SECRET);
                break;

            case 'forgotPassword':
                isValid = await jwt.verify(token, config.JWT_PASS_RESET_SECRET);
                break;

            default:
                throw new Error('wrong Action type');
        }

        return isValid;
    } catch (e) {
        throw new Error('Something wrong with token');
    }
};
