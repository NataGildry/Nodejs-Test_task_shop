const UserModel = require('../models/userSchema');
const {hashPassword} = require('../helpers');

module.exports = {
    getAllUsers: async (req, res) => {
        const users = await UserModel.find({});
        res.json(users)
    },
    createUser: async (req, res) => {
        try {
            const user = req.body;
            const {email, password, username} = user;
            const candidate = await UserModel.findOne({email});
            if (candidate) {
                return res.status(400).json(
                    {message: 'Username already exists'})
            }
                    const hashedPassword = await hashPassword(password);
                    const newUser = new UserModel ({email, password:hashedPassword, username});;
                   await newUser.save(user);
        } catch (e) {
            res.status(500).json({message: 'Something went wrong. User Registration failed'})
        }
        res.status(201).json({message: 'User have been created'});
    }
    };
