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
    commentsRef?.current?.lastChild.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddComment = async (e) => {
    const latestComment = { comment: newComment };
    try {
      e.preventDefault();
      setNewComment("");
      const res = await axios.patch(
        `${apiUrl}/article/addComment/${journalId}`,
        { userId, comment: newComment },
        { "Content-Type": "application/json" }
      );
      fetchComments();
      setComments(res.data.data.comments);
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  const convertDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

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
  useEffect(() => {
    fetchComments();
  }, [userId]);
  useEffect(() => {
    if (commentsRef.current.lastChild) scrollToBottom();
  }, [comments.length]);

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
          <Typography
            variant="body1"
            gutterBottom
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 500,
              fontSize: "0.875rem",
              color: "#333",
              letterSpacing: "0.05rem",
              lineHeight: 1.5,
              textAlign: "justify",
              hyphens: "auto",
            }}
          >
            {article?.description}
          </Typography>
          <div className="comments" style={{ marginTop: "40px" }}>
            <Typography variant="h4" gutterBottom>
              Comments
            </Typography>
            <div className="comment-list">
              <ul ref={commentsRef}>
                {comments?.map((comment, index) => (
                  <>
                    <li key={index} className="comment">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "nowrap",
                          }}
                        >
                          <div className="profileImage">
                            {comment?.userId?.firstName[0].toUpperCase()}
                            {comment?.userId?.lastName[0].toUpperCase()}
                          </div>
                          <h4>
                            {comment?.userId?.firstName
                              ? capitalizeFirstLetter(
                                  comment?.userId?.firstName
                                )
                              : ""}{" "}
                            {comment?.userId?.lastName
                              ? capitalizeFirstLetter(comment?.userId?.lastName)
                              : ""}
                          </h4>
                        </div>
                        <p
                          style={{
                            fontWeight: 500,
                            fontSize: "0.875rem",
                            color: "#333",
                          }}
                        >
                          {comment?.commentedDate
                            ? convertDate(comment?.commentedDate)
                            : ""}
                        </p>
                      </div>
                      <p
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          color: "#333",
                          letterSpacing: "0.05rem",
                          lineHeight: 1.5,
                          textAlign: "justify",
                          hyphens: "auto",
                        }}
                      >
                        {comment?.comment}
                      </p>
                    </li>
                  </>
                ))}
              </ul>
              <div></div>
            </div>
            <form style={{ display: "flex" }} onSubmit={handleAddComment}>
              <TextField
                variant="outlined"
                fullWidth
                label="Add a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button
                style={{ textTransform: "none" }}
                type="submit"
                variant="contained"
                color="primary"
                disabled={!newComment}
                size="small"
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
