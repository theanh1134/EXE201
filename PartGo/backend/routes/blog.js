const express = require('express');
const BlogPost = require('../models/BlogPost');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all blog posts
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, category } = req.query;

        let filter = { status: 'published' };
        if (category) filter.category = category;

        const posts = await BlogPost.find(filter)
            .populate('author', 'fullName')
            .sort({ publishedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await BlogPost.countDocuments(filter);

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

// Get blog post by slug
router.get('/:slug', async (req, res) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug })
            .populate('author', 'fullName');

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

// Create blog post (authenticated)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const postData = req.body;
        postData.author = req.user.userId;

        // Generate slug from title
        postData.slug = postData.title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        const post = new BlogPost(postData);
        await post.save();

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update blog post (authenticated)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user owns this post
        if (post.author.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedPost = await BlogPost.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Like blog post
router.put('/:id/like', async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);

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








