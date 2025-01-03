import express from 'express';
import { addPost, getPosts, deletePost, updatePost, getUserPosts } from '../controllers/postsController.js';
import auth from '../middleware/auth.js'

const router = express.Router();

// Get all posts
router.get('/', getPosts);
// Get users posts
router.get('/user', auth, getUserPosts);
// Add new post
router.post('/', auth, addPost);
// Delete post
router.delete('/:id', auth, deletePost);
// Update post
router.put('/:id', auth, updatePost);

export { router as postRoutes }
