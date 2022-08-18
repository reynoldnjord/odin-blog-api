const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.get_posts = async (req, res, next) => {
  try {
    const posts = await Post.find({});
    if (!posts) {
      return res.status(404).json({ error: "posts not found" });
    }
    res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.get_single_post = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ error: `post with id ${req.params.id} not found` });
    }
    res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
};

exports.create_post = [
  body("title").trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        data: req.body,
        errors: errors.array(),
      });
      return;
    }
    const { author_name, title, text } = req.body;
    const post = new Post({
      author_name,
      title,
      text,
    }).save((err) => {
      if (err) return next(err);
      res.status(200).json({ message: "post send" });
    });
  },
];

exports.update_post = async (req, res, next) => {
  try {
    const { author_name, title, text } = req.body;
    const post = await Post.findByIdAndUpdate(req.params.id, {
      author_name,
      title,
      text,
    });
    if (!post) {
      return res.status(404).json({ error: `post ${req.params.id} not found` });
    }
    res.status(200).json({ message: "updated successfully" });
  } catch (err) {
    next(err);
  }
};

exports.delete_post = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: `post ${req.params.id} not found` });
    }
    res
      .status(200)
      .json({ message: `post ${req.params.id} deleted successfully` });
  } catch (err) {
    next(err);
  }
};
