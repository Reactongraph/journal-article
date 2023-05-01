import { React, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Modal,
} from "@material-ui/core";
import axios from "axios";
import Cookies from "js-cookie";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidationSchema } from "../utils/validationSchema";
import { formatThrowError } from "../utils/helper";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import "../Article/article.css";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";

const apiUrl = `${process.env.REACT_APP_BACKEND_URL}`;

const LoginForm = (props) => {
  const { onClose } = props;
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
  });
  const [loading, setloading] = useState(false);
  useEffect(() => {
    const userId = Cookies.get("userId");
    if (userId) {
      navigate("/article");
    }
  }, [navigate]);

  const setCookies = (data) => {
    Cookies.set("token", data.token);
    Cookies.set("userName", data.data.firstName);
    Cookies.set("userId", data.data._id);
  };

  const handleGoogleCallBackResponse = async (response) => {
    const user_object = jwtDecode(response.credential);
    const googleLoginData = {
      name: user_object?.name,
      email: user_object?.email,
    };
    try {
      setloading(true);

      const { status, data } = await axios.post(
        `${apiUrl}/auth/googleLogin`,
        googleLoginData
      );
      if (status >= 400) {
        formatThrowError(data?.message);
        setError("Something went wrong, Please try again");
      } else if (status >= 200 && status <= 204) {
        setCookies(data);
        navigate("/article");
      }
    } catch (error) {
      setSubmitDisabled(false);
      setError(error.response.data.error);
    } finally {
      setloading(false);
      setTimeout(() => {
        setloading(false);
      }, 3000); // 3 seconds timeout for testing purposes
    }
  };

  const [isSubmitDisabled, setSubmitDisabled] = useState(false);
  const [error, setError] = useState();

  const onSubmit = async (formData) => {
    setSubmitDisabled(true);
    try {
      const { status, data } = await axios.post(
        `${apiUrl}/auth/login`,
        formData
      );
      if (status >= 400) {
        formatThrowError(data?.message);
        setError("Something went wrong, Please try again");
      } else if (status >= 200 && status <= 204) {
        setCookies(data);
        navigate("/article");
      }
    } catch (error) {
      setSubmitDisabled(false);
      setError(error.response.data.error);
    }
  };
  return (
    <Container
      maxWidth="xs"
      style={{ marginTop: "106px", background: "#FFFFFF", height: "450px" }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              align="center"
              style={{ marginTop: "10px", borderRadius: "10px" }}
            >
              Login
            </Typography>
            <Button
              onClick={onClose}
              style={{
                top: "-50px",
                right: 0,
                left: "375px",
                paddingRight: "20px",
              }}
            >
              <CloseIcon />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              fullWidth
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={isSubmitDisabled}
            >
              {isSubmitDisabled ? "Logging in..." : "Login"}
            </Button>
          </Grid>
          {<span className="error">{error}</span>}
          <Grid item xs={12}>
            <Typography align="center" variant="body2">
              Don't have an account? <a href="/signup">Sign up</a>
            </Typography>
          </Grid>
        </Grid>
      </form>
      <Box
        className="google-login"
        style={{ maxWidth: "240px", margin: "20px auto" }}
        textAlign={"center"}
      >
        {loading ? (
          <Box style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleCallBackResponse(credentialResponse);
            }}
            onError={() => {
              setError("Login Failed");
            }}
          />
        )}
      </Box>
    </Container>
  );
};

export default LoginForm;
