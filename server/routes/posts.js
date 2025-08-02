const express = require("express");
const { body, validationResult } = require("express-validator");
const Post = require("../models/Post");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post(
  "/",
  [
    auth,
    body("content")
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage("Post content must be between 1 and 1000 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { content } = req.body;

      const post = new Post({
        content,
        author: req.user._id,
      });

      await post.save();
      await post.populate("author", "name email profilePicture");

      res.status(201).json(post);
    } catch (error) {
      console.error("Create post error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/posts
// @desc    Get all posts (with pagination)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("author", "name email profilePicture")
      .populate("comments.user", "name profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/posts/:id
// @desc    Get a specific post
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email profilePicture")
      .populate("comments.user", "name profilePicture");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Get post error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put(
  "/:id",
  [
    auth,
    body("content")
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage("Post content must be between 1 and 1000 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { content } = req.body;

      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if user owns the post
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }

      post.content = content;
      await post.save();
      await post.populate("author", "name email profilePicture");

      res.json(post);
    } catch (error) {
      console.error("Update post error:", error);
      if (error.kind === "ObjectId") {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await post.deleteOne();

    res.json({ message: "Post removed" });
  } catch (error) {
    console.error("Delete post error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/posts/:id/like
// @desc    Like/Unlike a post
// @access  Private
router.put("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likeIndex = post.likes.indexOf(req.user._id);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();
    await post.populate("author", "name email profilePicture");

    res.json(post);
  } catch (error) {
    console.error("Like post error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/posts/:id/comments
// @desc    Add a comment to a post
// @access  Private
router.post(
  "/:id/comments",
  [
    auth,
    body("content")
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage("Comment must be between 1 and 500 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { content } = req.body;

      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      post.comments.unshift({
        user: req.user._id,
        content,
      });

      await post.save();
      await post.populate("author", "name email profilePicture");
      await post.populate("comments.user", "name profilePicture");

      res.json(post);
    } catch (error) {
      console.error("Add comment error:", error);
      if (error.kind === "ObjectId") {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
