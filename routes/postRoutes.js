const express = require("express");
const Post = require("../models/post");
const authMiddleware = require("../middleware/authmiddleware");
const mongoose = require("mongoose");
const router = express.Router();
router.post("/", authMiddleware, async(req, res) => {
    const {title, content } = req.body;
    if (!title || !content) {
    return res.status(400).json({
        message: "Title and content are required"
    });
}
    const post = new Post({
        title,
        content,
        author: req.user
    });
    await post.save();
    res.status(201).json(post);
});

router.get("/", async(req, res) => {
    const posts = await Post.find();
    res.status(200).json(posts);
});
router.get("/:id", async(req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
        message: "Invalid post ID"
    });
}
    const post = await Post.findById(req.params.id);

    if(!post){
        return res.status(404).json({
            message: "post not found"
        });
    }
    res.status(200).json(post);
});

router.put("/:id", authMiddleware, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
        message: "Invalid post ID"
    });
}
    const post = await Post.findById(req.params.id);

    if(!post){
        return res.status(404).json({
            message: "Post not found"
        });
    }
    if(post.author.toString() !== req.user){
        return res.status(403).json({
            message: "Cannot procees further as you are not the author"
        });
    }
    post.title = req.body.title;
    post.content = req.body.content;
    if (!req.body.title || !req.body.content) {
    return res.status(400).json({
        message: "Title and content are required"
    });
}

    await post.save();
    res.status(200).json(post);
});

router.delete("/:id", authMiddleware, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
        message: "Invalid post ID"
    });
}
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    if (post.author.toString() !== req.user) {
        return res.status(403).json({
            message: "You are not allowed to delete this post"
        });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
        message: "Post deleted successfully"
    });
});

module.exports = router;