const express = require("express");
const router = express.Router();
const post_controller = require("../controllers/postController");
const user_controller = require("../controllers/userController");
const comment_controller = require("../controllers/commentController");
const passport = require("passport");

router.get("/", (req, res, next) => {
  res.redirect("/api/posts");
});


/// USER AUTH///

router.post("/signup", user_controller.signup);
router.post("/login", user_controller.login);
router.get("/logout", user_controller.logout);


/// POSTS ///

router.get("/posts", post_controller.get_posts);
router.get("/posts/:id", post_controller.get_single_post);
router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  post_controller.create_post
);
router.put(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  post_controller.update_post
);
router.delete(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  post_controller.delete_post
);


/// COMMENTS ///
    
router.get("/posts/:postid/comments", comment_controller.get_comments);
router.get(
  "/posts/:postid/comments/:commentid",
  comment_controller.get_single_comment
);
router.post("/posts/:postid/comments", comment_controller.create_comment);
router.put(
  "/posts/:postid/comments/:commentid",
  passport.authenticate("jwt", { session: false }),
  comment_controller.update_comment
);
router.delete(
  "/posts/:postid/comments/:commentid",
  passport.authenticate("jwt", { session: false }),
  comment_controller.delete_comment
);
router.delete(
  "/posts/:postid/comments",
  passport.authenticate("jwt", { session: false }),
  comment_controller.delete_all_comments
);

module.exports = router;
