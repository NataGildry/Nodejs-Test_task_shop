const AccessTokenModel = require('../models/accessTokenSchema');
const UserModel = require('../models/userSchema');
const tokinizer = require('../helpers/tokinizer');
const comparePassword = require('../helpers/passwordCompareHelper');
const {loginValidation} = require('../helpers/emailPasswordValidator');
const tokenVerificatorHelper = require('../helpers/tokenVerificatorHelper');

module.exports = {
    authUser: async (req, res, next) => {
        // validate the user
        const {error} = loginValidation(req.body);
        if (error) {
            return res.status(400).json({error: error.details[0].message});
        }
        const user = req.body;
        const {email, password} = user;
        try {
            const candidate = await UserModel.findOne({email});
            if (candidate) {
                const isPasswordEquals = await comparePassword(password, candidate.password);
                if (!isPasswordEquals) {
                    return res.status(404).json({message: 'Record not found'});
                } else {
                    if (candidate.status !== 'confirmed') {
                        return res.status(403).json({message: 'User is not confirmed'});
                    }
                    const {accessToken, refreshToken} = tokinizer('userAuth');
                    const tokensToCreate = new AccessTokenModel({
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        userId: candidate._id
                    });
                    await tokensToCreate.save();
                    return res.json({accessToken, refreshToken});
                }
            }
            return res.status(404).json({message: 'Record not found'});
        } catch (e) {
            return res.status(500).json({message: 'User logination is failed'});
        }
    },
    logoutUser: async (req, res) => {
        const token = req.get('Authorization');
        try {
            if (!token) {
                return new Error('Token is not present');
            }
            await tokenVerificatorHelper('userAuth', token);

            const userByToken = await AccessTokenModel
                .findOne({accessToken: token})
                .populate('userId')
                .select({userId: 1, _id: 0});

            if (!userByToken) {
                return new Error('Record not found');
            }
            req.user = userByToken.toJSON();
            await AccessTokenModel.findOneAndDelete({token});
        } catch (e) {
            return new Error('Token is not present') + e;
        }
        return res.status(204).json({message: 'No content'});
    }
};
