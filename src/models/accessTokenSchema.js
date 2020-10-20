const { Schema, model } = require('mongoose');

const schema = new Schema({
        accessToken: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }, {
        timestamps: true
    });
module.exports = model('AccessToken', schema);
