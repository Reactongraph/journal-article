import { Navigate } from "react-router-dom";

export const formatThrowError = (message) => {
  let error = new Error(message);
  error.response = message;
  if (message?.includes("Given resource id is invalid")) {
    Navigate("/");
    return;
  }
  throw error;
};
