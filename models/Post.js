const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    comments: [
        {
            user: {
                type:String,
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
