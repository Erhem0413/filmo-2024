import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../../api/modules/user.api";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { setUser } from "../../redux/features/userSlice";

const SigninForm = ({ switchAuthState }) => {
  const dispatch = useDispatch();

  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [isResetPasswordRequest, setIsResetPasswordRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);


  const signinForm = useFormik({
    initialValues: {
      password: "",
      username: ""
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(8, "username minimum 8 characters")
        .required("username is required"),
      password: Yup.string()
        .min(8, "password minimum 8 characters")
        .required("password is required")
    }),
    onSubmit: async values => {
      setErrorMessage(undefined);
      setIsLoginRequest(true);
      console.log("asdasdasdasd");
      const { response, err } = await userApi.signin(values);
      setIsLoginRequest(false);

      if (response) {
        signinForm.resetForm();
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
        toast.success("Амжилттай нэвтэрлээ");
      }

      if (err) setErrorMessage(err.message);
    }
  });

  const resetPasswordForm = useFormik({
    initialValues: {
      email: ""
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required")
    }),
    onSubmit: async values => {
      setErrorMessage(undefined);
      setIsResetPasswordRequest(true);

      const { response, err } = await userApi.resetPassword(values.email);
      setIsResetPasswordRequest(false);

      if (response) {
        resetPasswordForm.resetForm();
        setResetPasswordSuccess(true);
        toast.success("Reset password link sent successfully");
      }

      if (err) setErrorMessage(err.message);
    }
  });

  return (
    <Box component="form" onSubmit={signinForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          type="text"
          placeholder="нэвтрэх нэр"
          name="username"
          fullWidth
          value={signinForm.values.username}
          onChange={signinForm.handleChange}
          color="success"
          error={signinForm.touched.username && signinForm.errors.username !== undefined}
          helperText={signinForm.touched.username && signinForm.errors.username}
        />
        <TextField
          type="password"
          placeholder="нууц үг"
          name="password"
          fullWidth
          value={signinForm.values.password}
          onChange={signinForm.handleChange}
          color="success"
          error={signinForm.touched.password && signinForm.errors.password !== undefined}
          helperText={signinForm.touched.password && signinForm.errors.password}
        />
      </Stack>


      {/* Reset password section */}
      {resetPasswordSuccess ? (
        <Alert severity="success">Reset password link sent to your email</Alert>
      ) : (
        <>
          <TextField
            type="email"
            placeholder="Email"
            name="email"
            fullWidth
            value={resetPasswordForm.values.email}
            onChange={resetPasswordForm.handleChange}
            color="success"
            error={resetPasswordForm.touched.email && resetPasswordForm.errors.email !== undefined}
            helperText={resetPasswordForm.touched.email && resetPasswordForm.errors.email}
          />
          <LoadingButton
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            sx={{ marginTop: 2 }}
            loading={isResetPasswordRequest}
          >
            Reset Password
          </LoadingButton>
        </>
      )}



      <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ marginTop: 4 }}
        loading={isLoginRequest}
      >
        нэвтрэх
      </LoadingButton>

      <Button
        fullWidth
        sx={{ marginTop: 1 }}
        onClick={() => switchAuthState()}
      >
        бүртгүүлэх
      </Button>

      {errorMessage && (
        <Box sx={{ marginTop: 2 }}>
          <Alert severity="error" variant="outlined" >{errorMessage}</Alert>
        </Box>
      )}
    </Box>
  );
};

export default SigninForm;