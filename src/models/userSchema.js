const {Schema, model} = require('mongoose');
const uuidv4 = require('uuid').v4;

const tokenSubModel = {
    token: String,
    action: String
};

const schema = new Schema({
        // _id: {
        //     type: String,
        //     default: uuidv4
        // },
        // _id: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'AccessToken'
        // },
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
