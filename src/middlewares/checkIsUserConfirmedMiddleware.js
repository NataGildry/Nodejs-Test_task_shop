const UserModel = require('../models/userSchema');

module.exports = async (req, res, next) => {
    const user = req.body;
    const {email} = user;
    try {
        const candidate = await UserModel.findOne({email});
        if (candidate) {
            const {_id, status, tokens = []} = candidate;
            const tokenToDelete = req.get('Authorization');

            if (status !== 'pending') {
                return new Error('User is already activated');
            }
            await UserModel.updateOne({_id}, {status: 'confirmed'}, {new: true});
            const index = tokens.findIndex(({action, token}) => {
                return token === tokenToDelete && action === 'userRegister';
            });

            if (index !== -1) {
                tokens.splice(index, 1);

                await UserModel.updateOne({_id}, {tokens}, {new: true});
            }
        }
    } catch (e) {
        next(e);
    }

    return next();
};
