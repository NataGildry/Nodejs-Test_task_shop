const {Schema, model} = require('mongoose');

const schema = new Schema ({
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
            ref: 'user'
        }
    }, {
        timestamps: true
    }
);
module.exports = model('accessTokenSchema', schema);
