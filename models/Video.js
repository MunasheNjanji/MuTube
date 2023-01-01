const mongoose = require('mongoose');
const Schema = mongoose.Schema

const VideoSchema = new Schema(
    {
        title: {
            type: String,
            minlength: [3, 'Must be at least 3 characters!!!']
        },
        description: {
            type: String,
            default: ''
        },
        thumbnailUrl: {
            type: String,
            default: 'no-photo.jpg'
        },
        views: {
            type: Number,
            default: 0
        },
        url: {
            type: String
        },
        status: {
            type: String,
            enum: ['draft', 'private', 'public'],
            default: 'draft'
        }, categoryId: {
            categoryId: mongoose.Schema.ObjectId,
            ref: 'Category'
        },
        userId: {
            UserId: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
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
);

VideoSchema.index({title: 'text'});

VideoSchema.virtual('likes', {

});

VideoSchema.virtual('dislikes', {

});

VideoSchema.virtual('comments', {

});

module.exports = mongoose.model('Video', VideoSchema)