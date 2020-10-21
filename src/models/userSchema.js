const { Schema, model } = require('mongoose');

const tokenSubModel = {
    token: String,
    action: String
};

const schema = new Schema({
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3
        },
        status: {
            type: String,
            required: true,
            default: 'pending'
        },
        tokens: [tokenSubModel]
    },
    {
        timestamps: true
    });
module.exports = model('User', schema);
