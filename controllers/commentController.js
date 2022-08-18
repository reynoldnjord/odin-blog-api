const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");

exports.get_comments = async (req, res, next) => {
  try {
    const allComments = await Comment.find({});
    const comments = allComments.filter((comment) => {
      comment.postId === req.params.postid;
    });
    if (!comments) {
      return res.status(404).json({ error: "comments not found" });
    }
    res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
};

exports.get_single_comment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentid);
    if (!comment) {
      return res
        .status(404)
        .json({ error: `comment with id ${req.params.commentid} not found` });
    }
    res.status(200).json({ comment });
  } catch (err) {
    next(err);
  }
};

exports.create_comment = [
  body("text").trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        data: req.body,
        errors: errors.array(),
      });
      return;
    }
    const { text, user } = req.body;
    const postId = req.params.postid;
    const comment = new Comment({ text, user, postId });
    comment.save((err) => {
      if (err) return next(err);
      res.status(200).json({ message: "comment send" });
    });
  },
];

exports.update_comment = async (req, res, next) => {
  try {
    const { text, user } = req.body;
    const comment = await Comment.findByIdAndUpdate(req.params.commentid, {
      title,
      user,
    });
    if (!comment) {
      return res
        .status(404)
        .json({ error: `comment ${req.params.id} not found` });
    }
    res.status(200).json({ message: "updated successfully" });
  } catch (err) {
    next(err);
  }
};

exports.delete_comment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentid);
    if (!comment) {
      return res
        .status(404)
        .json({ error: `comment ${req.params.id} not found` });
    }
    res
      .status(200)
      .json({ message: `comment ${req.params.id} deleted successfully` });
  } catch (err) {
    next(err);
  }
};

exports.delete_all_comments = async (req, res, next) => {
  try {
    const comment = await Comment.deleteMany({ postId: req.params.postid });
    if (!comment) {
      return res
        .status(404)
        .json({ error: `comment ${req.params.id} not found` });
    }
    res
      .status(200)
      .json({ message: `comment ${req.params.id} deleted successfuly` });
  } catch (err) {
    next(err);
  }
};
