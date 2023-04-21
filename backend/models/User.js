const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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

//login method
UserSchema.statics.login = async function (email, password) {
  
        

    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    const exists = await this.findOne({ email });

    if (!exists) {
        throw Error('Incorrect Email');
    }




        




    const match = await bcrypt.compare(password, exists.password);

    if (!match) {
        throw new Error('Invalid Credentials.')
    }
    return exists;
 
}





module.exports = User = mongoose.model("user", UserSchema);


