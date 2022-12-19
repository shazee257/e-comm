const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    mobile: String,
    password: String,
    role: {
        type: String,
        default: 'user'
    },
    refreshToken: String,
},
    {
        timestamps: true
    }
);

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
}

const UserModel = mongoose.model('User', userSchema);

exports.createUser = (obj) => {
    const user = UserModel.create(obj);
    return user;
}

exports.findUser = (query) => {
    const user = UserModel.findOne(query);
    return user;
}

exports.updateUserById = (_id, obj) => {
    const user = UserModel.findByIdAndUpdate(_id, obj, {
        new: true,
    });
    return user;
}




