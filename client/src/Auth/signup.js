import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
} from "@material-ui/core";
import axios from "axios";
import Cookies from "js-cookie";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpValidationSchema } from "../utils/validationSchema";
import "../Article/article.css";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { formatThrowError } from "../utils/helper";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";

const apiUrl = `${process.env.REACT_APP_BACKEND_URL}`;

const SignupForm = (props) => {
  const { onClose } = props;
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpValidationSchema),
  });

  const [isSubmitDisabled, setSubmitDisabled] = useState(false);
  const [error, setError] = useState();
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (userId) {
      navigate("/article");
    }
  }, []);
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

  const onSubmit = async (data) => {
    setSubmitDisabled(true);
    try {
      const res = await axios.post(`${apiUrl}/auth/signup`, data, {
        "Content-Type": "application/json",
      });
      if (res.data) {
        navigate("/");
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
              Sign up
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
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              fullWidth
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              fullWidth
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
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
              {isSubmitDisabled ? "Sign up in progress..." : "Sign up"}
            </Button>
          </Grid>
          {<span className="error">{error}</span>}
          <Grid item xs={12}>
            <Typography align="center" variant="body2">
              Already have an account? <a href="/login">Login</a>
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

export default SignupForm;
