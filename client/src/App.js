import React from "react";
import { BrowserRouter as Router, Route, Routes, HashRouter } from "react-router-dom";
import { Container } from "@material-ui/core";
import SignupForm from "./Auth/signup";
import LoginForm from "./Auth/login";
import Article from "./Article/article";
import { PrivateRoute } from "./PrivateRoute";

const App = () => {
  return (
    <Container>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route exact path="/" element={<PrivateRoute />}>
            <Route path="/article" element={<Article />} />
          </Route>
        </Routes>
      </HashRouter>
    </Container>
  );
};

export default App;
