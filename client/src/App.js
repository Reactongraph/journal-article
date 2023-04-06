import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "@material-ui/core";
import SignupForm from "./Auth/signup";
import LoginForm from "./Auth/login";
import Article from "./Article/article";
import { PrivateRoute } from "./PrivateRoute";

const App = () => {
  return (
    <Container>
      <Router>
        <Routes>
          <Route exact path="/" element={<LoginForm />} />
          <Route exact path="/signup" element={<SignupForm />} />
          <Route exact path="/login" element={<LoginForm />} />
          <Route exact path="/" element={<PrivateRoute />}>
            <Route path="/article" element={<Article />} />
          </Route>
        </Routes>
      </Router>
    </Container>
  );
};

export default App;
