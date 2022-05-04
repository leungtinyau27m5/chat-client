import {
  Autocomplete,
  autocompleteClasses,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  styled,
  textFieldClasses,
  Typography,
  typographyClasses,
} from "@mui/material";
import { StyledTextField } from "../styled/MyTextField";
import FileUploader from "src/components/forms/FileUploader";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Controller as SwiperController } from "swiper";
import type { Swiper } from "swiper";
import "swiper/css";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { getEmailRegex } from "src/helpers/common";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import { roles } from "src/components/dialogs/constants";
import { useSnackbar } from "notistack";
import { useChatSocketCtx } from "src/providers/socket.io/chat/context";
import { Data } from "src/shared/data.proto";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const StyledForm = styled(Box)(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  "& .steps": {},
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
  [`& .${textFieldClasses.root}`]: {
    width: "100%",
  },
  [`& .${autocompleteClasses.root}`]: {
    width: "100%",
  },
  "& .swiper-slide": {
    height: 0,
    "&.swiper-slide-active": {
      height: "auto",
    },
  },
  "& .member-list": {
    maxHeight: "55vh",
    overflowY: "auto",
    paddingBottom: 12,
    paddingTop: 12,
    display: "flex",
    flexDirection: "column",
    rowGap: 12,
    flexWrap: "nowrap",
    "& .member-row": {
      display: "flex",
      columnGap: 8,
      alignItems: "center",
      [theme.breakpoints.down("sm")]: {
        columnGap: 4,
      },
      "& .member-email": {
        flex: 5,
      },
      "& .member-role": {
        flex: 3,
        [theme.breakpoints.down("sm")]: {
          flex: 5,
        },
      },
    },
  },
}));

const CreateGroupChat = (props: CreateGroupChatProps) => {
  const { open, toggle } = props;
  const { wss } = useChatSocketCtx();
  const [avatar, setAvatar] = useState("");
  const [step, setStep] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const { control, handleSubmit, reset } = useForm<CreateGroupChatFormState>({
    mode: "onBlur",
  });
  const [controlledSwiper, setControlledSwiper] = useState<Swiper | null>(null);
  const {
    fields: members,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "members",
  });

  const handleFilesChange = (evt: FileList | null) => {
    if (evt instanceof FileList && evt.length > 0) {
      setAvatar(URL.createObjectURL(evt[0]));
      return;
    }
    setAvatar("");
  };

  const changeSteps = (n: number) => setStep(n);

  const toggleAppendMemebr = () => {
    append({
      email: "",
      role: "member",
    });
  };

  const submitCreateGroupForm: SubmitHandler<CreateGroupChatFormState> = (
    evt
  ) => {
    console.log(evt);
    const { bio, members, name } = evt;
    if (name === "") {
      enqueueSnackbar("Group must be named!", { variant: "warning" });
      setStep(0);
      return;
    }
    wss.emit(
      "chat:create",
      {
        profile_pic: avatar || null,
        name,
        bio,
        type: "group",
      },
      members
    );
    toggle(false);
  };

  useEffect(() => {
    if (!controlledSwiper) return;
    if (controlledSwiper.destroyed) return;
    controlledSwiper.slideTo(step);
  }, [step, controlledSwiper]);

  useEffect(() => {
    return () => {
      reset({
        members: [],
        name: "",
        bio: "",
      });
    };
  }, [open, reset]);

  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          margin: 1,
        },
      }}
    >
      <DialogTitle>Create Group Chat</DialogTitle>
      <IconButton
        onClick={() => toggle(false)}
        className="btn-close"
        color="error"
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseRoundedIcon />
      </IconButton>
      <DialogContent>
        <StyledForm
          component="form"
          onSubmit={handleSubmit(submitCreateGroupForm)}
        >
          <SwiperComponent
            spaceBetween={12}
            modules={[SwiperController]}
            onSwiper={(swiper) => setControlledSwiper(swiper)}
          >
            <SwiperSlide>
              <Grid container spacing={3} className={clsx("steps")}>
                <Grid item xs={6} container alignItems="center">
                  <Controller
                    control={control}
                    name="name"
                    defaultValue=""
                    render={({ field, fieldState: { error } }) => (
                      <StyledTextField
                        variant="outlined"
                        label="Group name"
                        error={error !== undefined}
                        helperText="*Required"
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6} container>
                  <FileUploader
                    id="group-avatar"
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
                <Grid item xs={12} container>
                  <Controller
                    control={control}
                    name="bio"
                    defaultValue=""
                    render={({ field }) => (
                      <StyledTextField
                        variant="outlined"
                        label="Bio"
                        multiline
                        rows={5}
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} container justifyContent="space-between">
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => toggle(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={() => changeSteps(1)}>
                    Next
                  </Button>
                </Grid>
              </Grid>
            </SwiperSlide>
            <SwiperSlide>
              <Grid container className={clsx("steps")}>
                <Grid item xs={6} container alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">Members</Typography>
                </Grid>
                <Grid container className="member-list">
                  {members.map((field, index) => (
                    <Box key={field.id} className="member-row">
                      <Box className="member-email">
                        <Controller
                          control={control}
                          name={`members.${index}.email`}
                          defaultValue=""
                          rules={{
                            pattern: getEmailRegex(),
                            maxLength: 255,
                          }}
                          render={({ field }) => (
                            <StyledTextField
                              variant="outlined"
                              label="Email"
                              {...field}
                            />
                          )}
                        />
                      </Box>
                      <Box className="member-role">
                        <Controller
                          control={control}
                          name={`members.${index}.role`}
                          defaultValue="member"
                          render={({ field }) => (
                            <Autocomplete
                              options={roles}
                              defaultValue="member"
                              renderInput={(params) => (
                                <StyledTextField
                                  {...params}
                                  {...field}
                                  label="Role"
                                />
                              )}
                            />
                          )}
                        />
                      </Box>
                      <Box className="row-actions">
                        <Button
                          sx={{ p: 0, minWidth: 0 }}
                          color="error"
                          onClick={() => remove(index)}
                        >
                          <RemoveCircleRoundedIcon />
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    onClick={toggleAppendMemebr}
                    sx={{ width: "100%", borderRadius: 10, mt: 1 }}
                  >
                    <AddRoundedIcon />
                  </Button>
                </Grid>
                <Grid item xs={12} container sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => changeSteps(0)}
                    >
                      Back
                    </Button>
                  </Grid>
                  <Grid item xs={6} container justifyContent="flex-end">
                    <Button variant="contained" type="submit">
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </SwiperSlide>
          </SwiperComponent>
        </StyledForm>
      </DialogContent>
    </Dialog>
  );
};

export interface CreateGroupChatFormState {
  name: string;
  bio: string;
  members: {
    email: string;
    role: Data.ParticipantRole;
  }[];
}

export interface CreateGroupChatProps {
  open: boolean;
  toggle: (open?: boolean) => void;
}

export default CreateGroupChat;
