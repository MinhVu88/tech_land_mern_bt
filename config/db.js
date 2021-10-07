const mongoose = require("mongoose"),
  config = require("config"),
  db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log("mongodb connected");
  } catch (error) {
    console.log(error.message);

    // in case of error, exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
