const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        channelName: {
            type: String,
            required: [true, 'Please add a channel name!'],
            unique: true,
            uniqueCaseInsensitive: true
        },
        email: {
            type: String,
            required: [true, 'Email address is missing!!'],
            unique: true,
            uniqueCaseInsensitive: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email!!!'
            ]
        },
        photoUrl: {
            type: String,
            default: 'no-photo.jpg',
        },
        role: {
            type: String,
            enum: ['user','admin'],
            default: 'user'
        },
        password: {
            type: String,
            required: [true, 'Please enter a password!!!'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false
        },
        resetPasswordToken: String,
        resetPasswordDate: Date
    },
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    }
)


UserSchema.index({channelName: 'text'});

UserSchema.virtual('subscribers', {
    ref: 'Subscription',
    localField: '_id',
    foreignField: 'channelId',
    justOne: false,
    count: true,
    match: {userId: this._id}
})

UserSchema.virtual('videos',{
    ref: 'Video',
    localField: '_id',
    foreignField: 'userId',
    justOne: false,
    count: true
})

UserSchema.plugin(uniqueValidator, {message: '{PATH} already exists.'});

UserSchema.pre('find',() => {
    this.populate({path: 'subscribers'});
});

// Encrypt password
UserSchema.pre('save', async (next) => {
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async (enteredPassword) => {
    return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.getSignedJwtToken = async () => {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

UserSchema.methods.resetPasswordToken = () => {
    // Generate a new token
    const resetToken = crypto.randomBytes(20).toString();

    // Hash token and set to reset password token
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken
}


module.exports = mongoose.model('User', UserSchema);