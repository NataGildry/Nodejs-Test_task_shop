const {Schema, model} = require('mongoose');
const uuidv4 = require('uuid').v4;

const schema = new Schema ({
        _id: { type: String,
            default: uuidv4,
        },
        email:{type:String,
            required:true,
            unique:true
        },
        password: {
            type:String,
            required:true,
        },
        username:{type:String,
            required:true,
            unique:true,
            trim:true,
            minlength:3
        }
    },
    {
        timestamps:true,
    });
module.exports = model('User', schema);
