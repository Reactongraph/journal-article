import { Typography, Paper, TextField, Button } from "@material-ui/core";
import React, { useState, useEffect, useRef } from "react";
import "./article.css";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "../navbar/navbar";
import { showToast } from "../utils/notification";

const apiUrl = `${process.env.REACT_APP_BACKEND_URL}`;
const journalId = `${process.env.REACT_APP_JOURNAL_ID}`;

const Article = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [article, setArticle] = useState();
  const userId = Cookies.get("userId");
  const userName = Cookies.get("userName");

  const commentsRef = useRef(null);

  const scrollToBottom = () => {
    commentsRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleAddComment = async (e) => {
    const latestComment = { comment: newComment };
    try {
      e.preventDefault();
      setComments([...comments, latestComment]);
      setNewComment("");
      const res = await axios.patch(
        `${apiUrl}/article/addComment/${journalId}`,
        { userId, comment: newComment },
        { "Content-Type": "application/json" }
      );
      scrollToBottom();
      showToast(res.data.message, "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/article/getArticle/${journalId}/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setArticle(res?.data?.article);
        setComments(res?.data?.article?.comments || []);
      } catch (error) {
        showToast(error.message, "error");
      }
    };
    fetchComments();
  }, [userId]);

  return (
    <body>
      <>
        <Navbar name={userName} />
        <Paper
          className="article-card"
          style={{ padding: "10px", marginTop: "20px" }}
        >
          <Typography variant="h3" gutterBottom>
            {article?.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {article?.description}
          </Typography>
          <div className="comments" style={{ marginTop: "40px" }}>
            <Typography variant="h4" gutterBottom>
              Comments
            </Typography>
            <div className="comment-list" >
              <ul >
                {comments?.map((comment, index) => (
                  <li key={index} className="comment">
                    <h4>{userName}</h4>
                    <p>{comment?.comment}</p>
                  </li>
                ))}
              </ul>
              <div ref={commentsRef}></div>
            </div>
            <form onSubmit={handleAddComment}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Add a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!newComment}
              >
                Add Comment
              </Button>
            </form>
          </div>
        </Paper>
      </>
    </body>
  );
};

export default Article;
