const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const AccountSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    accessToken: {
        type: String,
        required: true,
    },

    accountId: {
        type: String,
        required: true,
    },

    accountName: {
        type: String,
        required: true,
    },

    accountType: {
        type: String,
        required: true,
    },
});



module.exports = Account = mongoose.model("account", AccountSchema);


