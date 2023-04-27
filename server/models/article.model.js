const mongoose = require("mongoose");

// Create user schema
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  journalId: {
    type: String,
  },
  comments: [
    {
      commentedDate: Date,
      userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false,
        ref: "User",
      },
      comment: {
        type: String,
      },
    },
  ],
});

// Create user model
const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
