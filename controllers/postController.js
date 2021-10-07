const { validationResult } = require("express-validator"),
  UserModel = require("../models/User"),
  PostModel = require("../models/Post");

const createPost = async (req, res, next) => {
  console.log(
    "\nreq.body (post | routes/api/posts | postController) ->",
    req.body
  );

  const authUser = req.user,
    errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await UserModel.findById(authUser.id).select("-password");

    // apart from content which's provided by user on the frontend,
    // other fields of newPost come from user in the db
    const newPost = new PostModel({
      content: req.body.content,
      username: user.name,
      avatar: user.avatar,
      userId: authUser.id
    });

    await newPost.save();

    res.json(newPost);
  } catch (error) {
    console.log(error.message);

    res.status(500).send("server error");
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    // sort({date: -1}) -> sort the posts in ascending order (latest -> oldest)
    const posts = await PostModel.find().sort({ date: -1 });

    res.json(posts);
  } catch (error) {
    console.log(error.message);

    res.status(500).send("server error");
  }
};

const getPostById = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: "post not found" });
    }

    res.json(post);
  } catch (error) {
    console.log(error.message);

    // refer to getProfileByUserId in profileController
    if (error.kind == "ObjectId") {
      return res.status(400).json({ msg: "post not found" });
    }

    res.status(500).send("server error");
  }
};

const deletePostById = async (req, res, next) => {
  const authUser = req.user,
    postId = req.params.postId;

  try {
    const post = await PostModel.findById(postId),
      postCreatorId = post.userId;

    console.log(
      "\npostCreatorId (delete | routes/api/posts/:postId | postController) ->",
      typeof postCreatorId,
      " & authUser.id ->",
      typeof authUser.id
    );

    if (!post) {
      return res.status(404).json({ msg: "post not found" });
    }

    // make sure the user's deleting the post is the one that made it
    if (postCreatorId.toString() !== authUser.id) {
      return res
        .status(401)
        .json({ msg: "you're unauthorized to delete post" });
    }

    await post.remove();

    res.json({ msg: "post removed" });
  } catch (error) {
    console.log(error.message);

    if (error.kind == "ObjectId") {
      return res.status(400).json({ msg: "post not found" });
    }

    res.status(500).send("server error");
  }
};

const likePostById = async (req, res, next) => {
  const authUser = req.user,
    postId = req.params.postId;

  try {
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: "post not found" });
    }

    /*
    - Check if a post has been liked by a certain user more than once

    - likes is an array that contains a bunch of like objects,
      each of which consists of the id of the like itself & the id
      of the auth user that clicked the like button once (2 properties)
    
    - likes.some() returns a boolean (true if at least 1 element in the array 
      meets a condition & false otherwise)

    - The condition is check whether a like object's userId property is
      identical to the auth user's id that has just clicked the like button

    - If both ids are identical, that means the like button has been clicked
      by the same user more than once

    - If the ids are not the same, then the like button hasn't been clicked
      by that user before
    */
    let likes = post.likes,
      liked = likes.some(like => like.userId.toString() === authUser.id);

    console.log(
      "\nhas this post been liked once by this user before? (put | routes/api/posts/like/:postId | postController) ->",
      liked
    );

    if (liked) {
      return res
        .status(400)
        .json({ msg: "You can't like a post more than once" });
    }

    likes.unshift({ userId: authUser.id });

    console.log(
      "\ntotal likes per post (put | routes/api/posts/like/:postId | postController) ->",
      likes.length
    );

    await post.save();

    res.json(likes);
  } catch (error) {
    console.log(error.message);

    if (error.kind == "ObjectId") {
      return res.status(400).json({ msg: "post not found" });
    }

    res.status(500).send("server error");
  }
};

const unlikePostById = async (req, res, next) => {
  const authUser = req.user,
    postId = req.params.postId;

  try {
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: "post not found" });
    }

    let likes = post.likes,
      likesBySingleUser = likes.filter(
        like => like.userId.toString() === authUser.id
      );

    // a user can't unlike a post if he/she has never liked it once before
    if (likesBySingleUser.length === 0) {
      return res
        .status(400)
        .json({ msg: "Plz like the post once to unlike it" });
    }

    // remove a user's like
    const user = likes.map(like => like.userId.toString()),
      removedIndex = user.indexOf(authUser.id);

    console.log(
      "\nuser who liked a post once (put | routes/api/posts/unlike/:postId | postController) ->",
      user
    );

    likes.splice(removedIndex, 1);

    await post.save();

    res.json(likes);
  } catch (error) {
    console.log(error.message);

    if (error.kind == "ObjectId") {
      return res.status(400).json({ msg: "post not found" });
    }

    res.status(500).send("server error");
  }
};

const commentOnPost = async (req, res, next) => {
  console.log(
    "\nreq.body (post | routes/api/posts/comment/:postId | postController) ->",
    req.body
  );

  const authUser = req.user,
    postId = req.params.postId,
    errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await UserModel.findById(authUser.id).select("-password"),
      post = await PostModel.findById(postId),
      comments = post.comments;

    // username & avatar are from the user in the db
    const newComment = {
      content: req.body.content,
      username: user.name,
      avatar: user.avatar,
      userId: authUser.id
    };

    comments.unshift(newComment);

    await post.save();

    res.json(comments);
  } catch (error) {
    console.log(error.message);

    res.status(500).send("server error");
  }
};

const deletePostComment = async (req, res, next) => {
  const authUser = req.user,
    postId = req.params.postId,
    commentId = req.params.commentId;

  try {
    const post = await PostModel.findById(postId),
      comments = post.comments;

    // get the target comment from the db if it exists
    const targetComment = comments.find(comment => comment.id === commentId);

    if (!targetComment) {
      return res.status(404).json({ msg: "comment not found" });
    }

    console.log(
      "\ntargetComment from the db (delete | routes/api/posts/comment/:postId/:commentId | postController) ->",
      targetComment
    );

    // make sure the user that's deleting a comment is the one that made it
    if (targetComment.userId.toString() !== authUser.id) {
      return res
        .status(401)
        .json({ msg: "you're unauthorized to delete this comment" });
    }

    // remove a user's comment on a post
    const user = comments.map(comment => comment.userId.toString()),
      removedIndex = user.indexOf(authUser.id);

    console.log(
      "\nuser who removed his/her comment on a post (delete | routes/api/posts/comment/:postId/:commentId | postController) ->",
      user[0]
    );

    comments.splice(removedIndex, 1);

    await post.save();

    res.json(comments);
  } catch (error) {
    console.log(error.message);

    res.status(500).send("server error");
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  deletePostById,
  likePostById,
  unlikePostById,
  commentOnPost,
  deletePostComment
};
