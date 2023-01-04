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
    token: String,
},
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
    if (!this._update.password) {
        next();
    }

    this._update.password = await bcrypt.hash(this._update.password, 10);
    next();
});

userSchema.methods.matchPassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
}

const UserModel = mongoose.model('User', userSchema);



// create new user
exports.createUser = (obj) => {
    const user = UserModel.create(obj);
    return user;
}

// find user
exports.findUser = (query) => {
    const user = UserModel.findOne(query);
    return user;
}

// update user
exports.updateUserById = (_id, obj) => {
    const user = UserModel.findByIdAndUpdate(_id, obj, { new: true });
    return user;
}




