const mongoose = require("mongoose"),
  ProfileSchema = new mongoose.Schema({
    /**
    - Every profile is associated with a user

    - To create a reference to the User model, in ProfileSchema, 
      the user object's type property is assigned an ObjectId & 
      ref property is assigned 'user'

    - The ObjectId is the _id field of a user in the db (_id:ObjectId("...."))
     */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    company: String,
    website: String,
    location: String,
    status: { type: String, required: true },
    skills: { type: [String], required: true },
    bio: String,
    githubUsername: String,
    workExperience: [
      {
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: String,
        from: { type: Date, required: true },
        to: { type: Date },
        current: { type: Boolean, default: false },
        description: String
      }
    ],
    education: [
      {
        school: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: { type: String, required: true },
        from: { type: Date, required: true },
        to: { type: Date },
        current: { type: Boolean, default: false },
        description: String
      }
    ],
    social: {
      youtube: String,
      twitter: String,
      facebook: String,
      linkedin: String,
      instagram: String
    },
    date: { type: Date, default: Date.now }
  }),
  Profile = mongoose.model("profile", ProfileSchema);

module.exports = Profile;
