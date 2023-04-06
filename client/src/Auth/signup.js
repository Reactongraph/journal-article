import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import { yupResolver } from "@hookform/resolvers/yup";
import { showToast } from "../utils/notification";
import { signUpValidationSchema } from "../utils/validationSchema";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const SignupForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpValidationSchema),
  });
  useEffect(() => {
    const userId = Cookies.get("userId");
    if (userId) {
      navigate("/article");
    }
  }, []);
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${apiUrl}/auth/signup`,
        data,
        {
          "Content-Type": "application/json",
        }
      );
      if (res.data) {
        navigate("/");
        showToast(res.data.message, "success");
      }
    } catch (error) {
      showToast("Something went wrong, Please try again", "error");
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: "50px" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center">
              Sign up
            </Typography>
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
            <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
              Sign up
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography align="center" variant="body2">
              Already have an account? <a href="/login">Login</a>
            </Typography>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default SignupForm;
