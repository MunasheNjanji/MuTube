const mongoose = require('mongoose');
const  uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const CategorySchema = new Schema(
    {
        title: {
            type: String,
            minlength: [3, 'Category title must be at least three characters long'],
            trim: true,
            unique: true,
            uniqueCaseInsensitive: true,
            required: [true, "A category title must be provided!"],
        },
        description: {
            type: String,
            minlength: [3, 'Category description must be at least three characters long'],
            required: [true, "A category description must be provided!"]
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true]
        },
    },
    {timestamps: true}
)

CategorySchema.plugin(uniqueValidator, {message: '{PATH} already exists!!'})

module.exports = mongoose.model('Category', CategorySchema)