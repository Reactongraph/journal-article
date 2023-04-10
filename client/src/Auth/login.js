import { React, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import Cookies from "js-cookie";
import { yupResolver } from "@hookform/resolvers/yup";
import { showToast } from "../utils/notification";
import { loginValidationSchema } from "../utils/validationSchema";
import { formatThrowError } from "../utils/helper";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";

const apiUrl = `${process.env.REACT_APP_BACKEND_URL}`;

const LoginForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
  });

  const handleGoogleCallBackResponse = async (response) => {
    const user_object = jwtDecode(response.credential);
    const googleLoginData = {
      name: user_object?.name,
      email: user_object?.email,
    };
    try {
      const { status, data } = await axios.post(
        `${apiUrl}/auth/googleLogin`,
        googleLoginData
      );
      if (status >= 400) {
        formatThrowError(data?.message);
        showToast("Something went wrong, Please try again", "error");
      } else if (status >= 200 && status <= 204) {
        Cookies.set("token", data.token);
        Cookies.set("userName", data.data.firstName);
        Cookies.set("userId", data.data._id);
        showToast(data.message, "success");
        navigate("/article");
      }
    } catch (error) {
      setSubmitDisabled(false);
      showToast(error.response.data.error, "error");
    }
  };
  const [isSubmitDisabled, setSubmitDisabled] = useState(false);

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (userId) {
      navigate("/article");
    }
  }, [navigate]);

  const onSubmit = async (formData) => {
    setSubmitDisabled(true);
    try {
      const { status, data } = await axios.post(
        `${apiUrl}/auth/login`,
        formData
      );
      if (status >= 400) {
        formatThrowError(data?.message);
        showToast("Something went wrong, Please try again", "error");
      } else if (status >= 200 && status <= 204) {
        Cookies.set("token", data.token);
        Cookies.set("userName", data.data.firstName);
        Cookies.set("userId", data.data._id);
        showToast(data.message, "success");
        navigate("/article");
      }
    } catch (error) {
      setSubmitDisabled(false);
      showToast(error.response.data.error, "error");
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: "50px" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center">
              Login
            </Typography>
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
          <Grid item xs={12}>
            <Typography align="center" variant="body2">
              Don't have an account? <a href="/signup">Sign up</a>
            </Typography>
          </Grid>
        </Grid>
      </form>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          handleGoogleCallBackResponse(credentialResponse);
        }}
        onError={() => {
          showToast("Login Failed", "error");
        }}
      />
    </Container>
  );
};

export default LoginForm;
