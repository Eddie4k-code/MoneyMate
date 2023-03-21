const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const UserSchema = new Schema({

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true
    },

    isFree: {
        type: Boolean,
        default: true,
    }

});



module.exports = User = mongoose.model("user", UserSchema);


