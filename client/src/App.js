import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "@material-ui/core";
import SignupForm from "./Auth/signup";
import LoginForm from "./Auth/login";
import Article from "./Article/article";
import { PrivateRoute } from "./PrivateRoute";

const App = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const handleOpenLoginModal = () => {
    setLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setLoginModalOpen(false);
  };
  const handleOpenSignupModal = () => {
    setSignupModalOpen(true);
  };

  const handleCloseSignupModal = () => {
    setSignupModalOpen(false);
  };
  return (
    <Container>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Article
                loginModalOpen={loginModalOpen}
                handleCloseLoginModal={handleCloseLoginModal}
                handleOpenLoginModal={handleOpenLoginModal}
                signupModalOpen={signupModalOpen}
                handleCloseSignupModal={handleCloseSignupModal}
                handleOpenSignupModal={handleOpenSignupModal}
              />
            }
          />
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
