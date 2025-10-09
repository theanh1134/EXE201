const express = require('express');
const ForumPost = require('../models/ForumPost');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all forum posts
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, category } = req.query;

        let filter = {};
        if (category) filter.category = category;

        const posts = await ForumPost.find(filter)
            .populate('author', 'fullName')
            .sort({ isPinned: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await ForumPost.countDocuments(filter);

        res.json({
            posts,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get forum post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.id)
            .populate('author', 'fullName')
            .populate('replies.author', 'fullName');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Increment views
        post.views += 1;
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create forum post (authenticated)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const postData = req.body;
        postData.author = req.user.userId;

        const post = new ForumPost(postData);
        await post.save();

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add reply to forum post (authenticated)
router.post('/:id/replies', authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;
        const post = await ForumPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.replies.push({
            author: req.user.userId,
            content,
            createdAt: new Date()
        });

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Like forum post
router.put('/:id/like', async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.likes += 1;
        await post.save();

        res.json({ likes: post.likes });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;








