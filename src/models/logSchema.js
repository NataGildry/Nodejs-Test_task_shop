const { Schema, model } = require('mongoose');

const schema = new Schema({
        event: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        data: Schema.Types.Mixed
    }, {
        timestamps: true
    });
module.exports = model('logSchema', schema);
