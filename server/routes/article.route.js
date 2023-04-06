const express = require("express");
const articleController = require("../controllers/article.controller");

const router = express.Router();

router.get("/getArticle/:journalId/:userId", articleController.getArticle);
router.post("/addArticle", articleController.addArticle);
router.patch("/addComment/:journalId", articleController.addComment);

module.exports = router;
