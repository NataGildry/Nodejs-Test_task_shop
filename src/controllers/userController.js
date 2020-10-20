const UserModel = require('../models/userSchema');
const {hashPassword} = require('../helpers');
const {tokenVerificatorHelper} = require('../helpers');
const {registerValidation, emailValidator} = require('../helpers/emailPasswordValidator');
const jwt = require('jsonwebtoken');
const {config} = require('../config');
const {Types} = require('mongoose');
const tokinizer = require('../helpers');

module.exports = {
    getAllUsers: async (req, res) => {
        const users = await UserModel.find({});
        res.json(users);
    },
    createUser: async (req, res) => {
        // validate the user
        const {error} = registerValidation(req.body);
        if (error) {
            return res.status(400).json({error: error.details[0].message});
        }
        const user = req.body;
        const {email, password, username} = user;
        const candidate = await UserModel.findOne({email});
        if (candidate) {
            return res.status(400).json(
                {message: 'User already exists'}
            );
        }
        const hashedPassword = await hashPassword(password);
        const newUser = new UserModel({email, password: hashedPassword, username});
        try {
            await newUser.save(user);
            const token = jwt.sign(
                // payload data
                {
                    name: user.username,
                    id: user._id,
                },
                config.JWT_CONFIRM_EMAIL_SECRET
            );
            return res.header('userRegister', token).json({
                error: null,
                data: {
                    token,
                },
            });
        } catch (e) {
            res.status(500).json({message: 'Something went wrong. User Registration failed'});
        }
    },
    confirmUser: async (req, res) => {
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
            res.end();
        } catch (e) {
            res.status(500).json({message: 'Something went wrong. User Confirmation failed'} + e);
        }
    },
    forgotPassword: async (req, res) => {
        const user = req.body;
        const {email} = user;
        const {error} = emailValidator({email});
        if (error) {
            return res.status(400).json({error: error.details[0].message});
        }
        try {
            const candidate = await UserModel.findOne({email});

            if (!candidate) {
                return new Error('User not found');
            }

            const token = jwt.sign(
                // payload data
                {
                    id: user._id,
                },
                config.JWT_PASS_RESET_SECRET
            );
            await UserModel.updateOne(
                {_id: Types.ObjectId(user._id)},
                {
                    $push: {
                        token
                    }
                }
            );
            return res.header('userRegister', token).json({
                error: null,
                data: {
                    token,
                },
            });
        } catch (e) {
            res.status(500).json({message: 'Something went wrong with token'});
        }
    }
};
