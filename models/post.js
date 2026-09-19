const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        ref: "User",
        required: true
    }
});

const Post = mongoose.model("post", postSchema);
module.exports = Post;