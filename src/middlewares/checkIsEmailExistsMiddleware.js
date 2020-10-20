const UserModel = require('../models/userSchema');

export const checkIsEmailExistsMiddleware = async (req, res, next) => {
    const {email} = req.body;
    const userByEmail = await UserModel.findOne({email});

    if (userByEmail) {
        return next(new Error('User is already registered'));
    }
    next();
};
