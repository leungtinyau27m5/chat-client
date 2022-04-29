import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  filledInputClasses,
  Grid,
  IconButton,
  styled,
  svgIconClasses,
  Typography,
  typographyClasses,
} from "@mui/material";
import clsx from "clsx";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { StyledTextField } from "../styled/MyTextField";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffRounded";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import FileUploader from "./FileUploader";
import { postRegister } from "src/api/chat";
import { getEmailRegex, getPasswordRegex } from "src/helpers/common";
import { helperText } from "src/helpers/validator";
import axios from "axios";
import { ChatAxios } from "src/api/chat.proto";
import { useSnackbar } from "notistack";
import { ExpressCodeMap } from "src/api/express.proto";

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
  "& .upload-avatar": {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    alignItems: "center",
    width: "100%",
    [`& .${typographyClasses.root}`]: {
      position: "absolute",
      color: "grey",
      top: "50%",
      left: "50%",
      zIndex: 1,
      width: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.45)",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
    },
  },
  "& .form-actions": {
    marginTop: "2rem",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
}));

const RegisterForm = (props: RegisterFormProps) => {
  const { switchForm } = props;
  const { handleSubmit, control } = useForm<RegisterFormState>();
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const togglePassword = () => setShowPassword((state) => !state);

  const handleFilesChange = (evt: FileList | null) => {
    if (evt instanceof FileList && evt.length > 0) {
      setAvatar(URL.createObjectURL(evt[0]));
      return;
    }
    setAvatar("");
  };

  const submitRegisterForm: SubmitHandler<RegisterFormState> = async (evt) => {
    try {
      const res = await postRegister({
        email: evt.email,
        password: evt.password,
        username: evt.username,
        profilePic: avatar === "" ? null : avatar,
      });
      const { code, message } = res.data;
      enqueueSnackbar(message, {
        variant: "success",
      });
      switchForm("login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { code, message } = error.response
          ?.data as ChatAxios.Register.Response;
        if (message === "ER_DUP_ENTRY") {
          return enqueueSnackbar("Duplicated email", {
            variant: "warning",
          });
        } else if (code === ExpressCodeMap.invalidParameter) {
          return enqueueSnackbar("Parameter is invalid", {
            variant: "warning",
          });
        }
        enqueueSnackbar(error.response?.statusText, {
          variant: "error",
        });
      } else if (error instanceof Error) {
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      } else {
        enqueueSnackbar("unknwon error", {
          variant: "error",
        });
      }
    }
  };

  return (
    <StyledBox
      component="form"
      className={clsx("form login-form")}
      onSubmit={handleSubmit(submitRegisterForm)}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} container justifyContent="center">
          <FileUploader
            id="user-avatar"
            accept="image/*"
            handleFilesChange={handleFilesChange}
          >
            {(fileList) =>
              fileList ? (
                <Avatar
                  src={avatar}
                  sx={{
                    width: 120,
                    height: 120,
                  }}
                />
              ) : (
                <Box className="upload-avatar">
                  <Typography>Click To Upload (Optional)</Typography>
                  <Avatar
                    src=""
                    sx={{
                      width: 120,
                      height: 120,
                    }}
                  />
                </Box>
              )
            }
          </FileUploader>
        </Grid>
        <Grid item xs={12} container justifyContent="center">
          <Controller
            control={control}
            name="username"
            defaultValue=""
            rules={{
              required: true,
              minLength: 3,
              maxLength: 25,
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledTextField
                variant="filled"
                placeholder="Username"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: <AccountBoxRoundedIcon />,
                }}
                error={error !== undefined}
                helperText={error ? "Should be 3-25 characters" : ""}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} container justifyContent="center">
          <Controller
            control={control}
            name="email"
            defaultValue=""
            rules={{
              required: true,
              pattern: getEmailRegex(),
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledTextField
                variant="filled"
                placeholder="Email"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: <EmailRoundedIcon />,
                }}
                error={error !== undefined}
                helperText={error ? helperText.email[error.type] : ""}
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
              pattern: getPasswordRegex(),
            }}
            render={({ field, fieldState: { error } }) => (
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
                error={error !== undefined}
                helperText={error ? helperText.password[error.type] : ""}
                {...field}
              />
            )}
          />
        </Grid>
      </Grid>
      <Box className="form-actions">
        <Button
          variant="text"
          color="success"
          onClick={() => switchForm("login")}
        >
          Have Account?
        </Button>
        <Box>
          <Button variant="outlined" color="error" type="reset">
            Reset
          </Button>
          <Button variant="contained" type="submit" sx={{ ml: 1 }}>
            Submit
          </Button>
        </Box>
      </Box>
    </StyledBox>
  );
};

export interface RegisterFormProps {
  switchForm: (tag: "register" | "login") => void;
}

export interface RegisterFormState {
  username: string;
  email: string;
  password: string;
  profilePic: string | null;
}

export default RegisterForm;
