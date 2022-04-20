import {
  Box,
  Button,
  filledInputClasses,
  Grid,
  IconButton,
  styled,
  svgIconClasses,
} from "@mui/material";
import clsx from "clsx";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffRounded";
import { StyledTextField } from "../styled/MyTextField";
import { useState } from "react";
import { postLogin } from "src/api/chat";
import { setCookie } from "src/utils/storages";
import { useSetRecoilState } from "recoil";
import { userSelector } from "src/data/user.atom";
import { ExpressCodeMap } from "src/api/express.proto";
import { useSnackbar } from "notistack";
import axios from "axios";

const StyledBox = styled(Box)(({ theme }) => ({
  width: "70vw",
  maxWidth: 480,
  backgroundColor: "white",
  borderRadius: 15,
  padding: "1rem",
  [theme.breakpoints.down("sm")]: {
    width: "85%",
  },
  [`& .${filledInputClasses.root}`]: {
    width: 295,
    [`& .${svgIconClasses.root}`]: {
      color: "darkslategrey",
    },
  },
  "& .form-actions": {
    marginTop: "2rem",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
}));

const LoginForm = (props: LoginFormProps) => {
  const { switchForm } = props;
  const setUserData = useSetRecoilState(userSelector);
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, control } = useForm<LoginFormState>();
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((state) => !state);

  const submitLoginForm: SubmitHandler<LoginFormState> = async (evt) => {
    const { email, password } = evt;
    try {
      const result = await postLogin({
        email,
        password,
      });
      const { code, data, message, token } = result.data;
      if (code === ExpressCodeMap.success) {
        if (data && token) setUserData({ ...data, token });
        return;
      }
      enqueueSnackbar(message, {
        variant: "warning",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { code, message } = error.response?.data;
        enqueueSnackbar(message, {
          variant: "error",
        });
      } else if (error instanceof Error) {
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      }
      enqueueSnackbar("unknown error", {
        variant: "error",
      });
    }
  };

  return (
    <StyledBox
      component="form"
      className={clsx("form login-form")}
      onSubmit={handleSubmit(submitLoginForm)}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} container justifyContent="center">
          <Controller
            control={control}
            name="email"
            defaultValue=""
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <StyledTextField
                variant="filled"
                placeholder="Email"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: <EmailRoundedIcon />,
                }}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} container justifyContent="center">
          <Controller
            control={control}
            name="password"
            defaultValue=""
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <StyledTextField
                variant="filled"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: <LockRoundedIcon />,
                  endAdornment: (
                    <IconButton onClick={togglePassword}>
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  ),
                }}
                {...field}
              />
            )}
          />
        </Grid>
      </Grid>
      <Box className="form-actions">
        <Button
          variant="text"
          color="warning"
          onClick={() => switchForm("register")}
        >
          Register?
        </Button>
        <Box>
          <Button variant="outlined" color="error" type="reset">
            Reset
          </Button>
          <Button variant="contained" type="submit" sx={{ ml: 1 }}>
            Login
          </Button>
        </Box>
      </Box>
    </StyledBox>
  );
};

export interface LoginFormProps {
  switchForm: (tag: "register" | "login") => void;
}

export interface LoginFormState {
  email: string;
  password: string;
}

export default LoginForm;
