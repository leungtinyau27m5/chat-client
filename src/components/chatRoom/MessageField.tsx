import { MouseEvent, useEffect, useRef, useState } from "react";
import { Box, Button, filledInputClasses, styled } from "@mui/material";
import { StyledTextField } from "../styled/MyTextField";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import InsertEmoticonRoundedIcon from "@mui/icons-material/InsertEmoticonRounded";
import { Data } from "src/shared/data.proto";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Picker, { IEmojiData } from "emoji-picker-react";
import clsx from "clsx";

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.2),
  display: "flex",
  flexDirection: "column",
  rowGap: 8,
  [theme.breakpoints.down("md")]: {
    padding: 0,
  },
  "& .inner": {
    flex: 1,
    boxShadow: "0px 0px 5px rgba(15, 15, 15, 0.15)",
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    "& .message-input": {
      flex: 1,
      backgroundColor: "rgba(30, 30, 30, 0.03)",
      marginTop: "0.35rem",
      marginBottom: "0.35rem",
      borderRadius: 10,
      "& textarea": {
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
        wordBreak: "break-all",
      },
      [`& .${filledInputClasses.root}`]: {
        paddingTop: "0.75rem",
        paddingBottom: "0.75rem",
        backgroundColor: "transparent",
        [`& .${filledInputClasses.input}`]: {},
      },
    },
    "& .action-container": {
      width: "fit-content",
      padding: "0.35rem",
      "& button": {
        padding: 0,
        width: 38,
        height: 38,
        minWidth: 0,
        maxWidth: "none",
        borderRadius: 12,
        "&:not(:last-of-type)": {
          marginRight: 5,
        },
      },
    },
  },
  "& .emoji-picker-container": {
    display: "none",
    "&.active": {
      display: "flex",
    },
    "& .emoji-picker-react": {
      width: "100%",
      flex: 1,
    },
  },
}));

const MessageField = (props: MessageFieldProps) => {
  const { sendMessage, chatId } = props;
  const { control, handleSubmit, reset, setValue, getValues, setFocus } =
    useForm<MessageFieldFormState>();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const handleSend: SubmitHandler<MessageFieldFormState> = (evt) => {
    sendMessage({
      message: evt.message,
      media: null,
      meta: {},
    });
    reset({
      message: "",
    });
  };

  const toggleEmojiPicker = () => setShowEmojiPicker((state) => !state);

  const onEmojiClick = (
    evt: MouseEvent<Element, globalThis.MouseEvent>,
    data: IEmojiData
  ) => {
    setValue("message", getValues("message") + data.emoji);
    setFocus("message");
  };

  useEffect(() => {
    return () => {
      reset({ message: "" });
    };
  }, [chatId, reset]);

  return (
    <StyledBox>
      <Box
        className="inner"
        component="form"
        onSubmit={handleSubmit(handleSend)}
      >
        <Box className="action-container">
          <Button variant="text" onClick={toggleEmojiPicker}>
            <InsertEmoticonRoundedIcon />
          </Button>
          {/* <Button variant="text">
            <AttachFileRoundedIcon />
          </Button> */}
        </Box>
        <Controller
          control={control}
          name="message"
          defaultValue=""
          render={({ field: { ref, ...field } }) => (
            <StyledTextField
              variant="filled"
              className="message-input"
              placeholder="Your Message Here"
              type="text"
              multiline
              maxRows={5}
              minRows={1}
              InputProps={{
                disableUnderline: true,
              }}
              inputRef={ref}
              {...field}
            />
          )}
        />
        <Box className="action-container">
          <Button color="primary" variant="contained" type="submit">
            <SendRoundedIcon />
          </Button>
        </Box>
      </Box>
      <Box
        className={clsx("emoji-picker-container", { active: showEmojiPicker })}
      >
        <Picker onEmojiClick={onEmojiClick} native disableAutoFocus />
      </Box>
    </StyledBox>
  );
};

export interface MessageFieldFormState {
  message: string;
}

export interface MessageFieldProps {
  chatId: number;
  sendMessage: (data: Data.SendMessage) => void;
}

export default MessageField;
