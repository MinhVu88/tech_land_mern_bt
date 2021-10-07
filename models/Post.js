const mongoose = require("mongoose"),
  PostSchema = new mongoose.Schema({
    /*
    - Every post is associated with a user

    - To create a reference to the User model, in PostSchema, 
      the user object's type property is assigned an ObjectId & 
      ref property is assigned 'user'

    - The ObjectId is the _id field of a user in the db (_id:ObjectId("...."))
    */
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    content: { type: String, required: true },
    username: String,
    avatar: String,
    /*
    - users can like (adding likes to this array) or 
      dislike (removing likes from it)

    - user is referenced within likes, 
      so a like can be traced back to a certain user

    - also a user can only like a post once, 
      they can't like a post multiple times
    */
    likes: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" }
      }
    ],
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        content: { type: String, required: true },
        username: String,
        avatar: String,
        commentDate: { type: Date, default: Date.now }
      }
    ],
    postDate: { type: Date, default: Date.now }
  }),
  Post = mongoose.model("post", PostSchema);

module.exports = Post;
