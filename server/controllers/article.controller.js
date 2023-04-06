const { Article } = require("../models");
const { ObjectId } = require("mongodb");

const getArticle = async (req, res) => {
  const journalId = req.params.journalId;
  const userId = req.params.userId;
  const ObjectId = require("mongodb").ObjectId;

  const article = await Article.aggregate([
    { $match: { journalId:journalId } },
    { $unwind: "$comments" },
    {
      $lookup: {
        from: "users",
        localField: "comments.userId",
        foreignField: "_id",
        as: "comments.userId",
      },
    },
    {
      $match: {
        "comments.userId._id": new ObjectId(userId),
      },
    },
    {
      $group: {
        _id: "$_id",
        title: { $first: "$title" },
        description: { $first: "$description" },
        comments: { $push: "$comments" },
      },
    },
  ]);
  let result;
  if (article && article.length > 0) {
    result = article[0];
  } else {
    result = await Article.findOne({journalId:journalId}).select("-comments");
  }
  res.send({ article: result });
};

const addComment = async (req, res) => {
  const userId = req.body.userId;
  const journalId = req.params.journalId;
  const article = await Article.findOne({journalId:journalId});
  const comments = article.comments || [];
  const newComment = {
    userId,
    comment: req.body.comment,
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
  const result = await Article.findOne({journalId:journalId}).populate("comments.userId");
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
