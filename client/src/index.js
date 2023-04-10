import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
const Id = `${process.env.GOOGLE_LOGIN_CLIENT_ID}`;
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={Id}>
      <App />
    </GoogleOAuthProvider>
    <ToastContainer />
  </React.StrictMode>
);

reportWebVitals();
