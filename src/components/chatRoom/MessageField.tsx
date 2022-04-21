import { Box, Button, filledInputClasses, styled } from "@mui/material";
import { StyledTextField } from "../styled/MyTextField";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import InsertEmoticonRoundedIcon from "@mui/icons-material/InsertEmoticonRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import { Data } from "src/shared/data.proto";
import { useState } from "react";

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.2),
  display: "flex",
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
}));

const MessageField = (props: MessageFieldProps) => {
  const { sendMessage } = props;
  const [message, setMessage] = useState("");

  const handleSend = () => {
    sendMessage({
      message,
      media: null,
      meta: {},
    });
  };

  return (
    <StyledBox>
      <Box className="inner">
        <Box className="action-container">
          <Button variant="text">
            <InsertEmoticonRoundedIcon />
          </Button>
          <Button variant="text">
            <AttachFileRoundedIcon />
          </Button>
        </Box>
        <StyledTextField
          variant="filled"
          className="message-input"
          placeholder="Your Message Here"
          value={message}
          onChange={(evt) => setMessage(evt.target.value)}
          type="text"
          multiline
          maxRows={5}
          minRows={1}
          InputProps={{
            disableUnderline: true,
          }}
        />
        <Box className="action-container">
          <Button color="primary" variant="contained" onClick={handleSend}>
            <SendRoundedIcon />
          </Button>
        </Box>
      </Box>
    </StyledBox>
  );
};

export interface MessageFieldProps {
  sendMessage: (data: Data.SendMessage) => void;
}

export default MessageField;
