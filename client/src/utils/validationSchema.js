import * as yup from "yup";

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Email must be a valid email address"),
  password: yup.string().required("Password is required"),
});

export const signUpValidationSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Email must be a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});
