const tokenVerificatorHelper = require('../helpers/tokenVerificatorHelper');
const AccessTokenModel = require('../models/accessTokenSchema');

module.exports = async (req, res, next) => {
    try {
        const token = req.get('Authorization');

        if(!token) {
            return next(new Error('Token is not present'));
        }

        await tokenVerificatorHelper('userAuth', token);

        const userByToken = await AccessTokenModel
            .findOne({ accessToken: token })
            .populate('userId')
            .select({ userId: 1, _id: 0 });

        if(!userByToken) {
            return next(new Error('Record not found'));
        }
        req.user = userByToken.toJSON();
        next();
    } catch (e) {
        next(e);
    }

    return next();
};
