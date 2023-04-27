const { Article } = require("../models");
const { ObjectId } = require("mongodb");

const getArticle = async (req, res) => {
  const journalId = req.params.journalId;

  try {
    const result = await Article.findOne({ journalId: journalId }).populate(
      "comments.userId"
    );
    res.send({ article: result });
  } catch (error) {
    console.log("error", error);
  }
};

const addComment = async (req, res) => {
  const userId = req.body.userId;
  const journalId = req.params.journalId;
  const article = await Article.findOne({ journalId: journalId });
  const comments = article.comments || [];
  const newComment = {
    userId,
    comment: req.body.comment,
    commentedDate: new Date(),
  };
  comments.push(newComment);
  await Article.findByIdAndUpdate(
    article._id,
    {
      comments,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  const result = await Article.findOne({ journalId: journalId }).populate(
    "comments.userId"
  );
  res.send({ message: "comment Added successfully", data: result });
};

const addArticle = async (req, res) => {
  const { title, description } = req.body;
  const newArticle = {
    title,
    description,
  };
  await Article.create(newArticle);
  res.send({ message: "Article Added successfully" });
};

module.exports = { getArticle, addComment, addArticle };
