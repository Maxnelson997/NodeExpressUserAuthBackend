import Post from '../models/PostModel.js';
import User from '../models/UserModel.js';
import mongoose from "mongoose";

// Get all posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
        res.status(200).json({ success: 'posts fetched', posts })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get a users posts
const getUserPosts = async (req, res) => {

    // Grab the authenticated user from req body.
    const user = await User.findById(req.user._id);

    try {
        const posts = await Post.find({ user: user._id })
        res.status(200).json({ success: 'Posts fetched: ', posts })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// Create new post
const addPost = async (req, res) => {
    // Grab the data from requests body.
    const { title, body } = req.body

    // Check the fields are not empty.
    if (!title || !body) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Grab the authenticated user from req body.
    const user = await User.findById(req.user._id);

    try {
        const post = await Post.create({ user: user._id, title, body })
        res.status(200).json({ success: 'post created: ', post })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Delete post by ID
const deletePost = async (req, res) => {
    // Check if the ID in the params is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid Post ID Param' });
    }

    // Check if the post exists
    const post = await Post.findById(req.params.id)
    if (!post) {
        return res.status(400).json({ error: 'Post not found' });
    }

    // Check if the user owns the post
    const user = await User.findById(req.user._id)
    if (!post.user.equals(user._id)) {
        return res.status(401).json({ error: "Not authorized" })
    }

    try {
        await post.deleteOne()
        res.status(200).json({ success: 'Post succesfully deleted', post })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// Update post by ID
const updatePost = async (req, res) => {
    // Grab the data from requests body.
    const { title, body } = req.body;

    // Check the fields are not empty.
    if (!title || !body) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if the ID in the params is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid Post ID Param' });
    }

    // Check if the post exists
    const post = await Post.findById(req.params.id)
    if (!post) {
        return res.status(400).json({ error: 'Post not found' });
    }

    // Check if the user owns the post
    const user = await User.findById(req.user._id)
    if (!post.user.equals(user._id)) {
        return res.status(401).json({ error: "Not authorized" })
    }

    try {
        await post.updateOne({ title, body })
        res.status(200).json({ success: "Post was updated" })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

export { getPosts, getUserPosts, addPost, deletePost, updatePost };