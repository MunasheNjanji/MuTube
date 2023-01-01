const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ReactionSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['like', 'dislike'],
            required: [true, 'A video can be liked or disliked!!']
        },
        videoId: {
            type: mongoose.Schema.OjectId,
            ref: 'Video',
            required: [true, 'A reaction should be to a video!!']
        },
        userId: {
            type: mongoose.Schema.OjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('Reaction', ReactionSchema);