import { useEffect } from "react";
import {
  Box,
  styled,
  Avatar,
  Typography,
  avatarClasses,
  TextField,
  List,
  ListItemButton,
} from "@mui/material";
import { Data } from "src/shared/data.proto";
import { getProfilePic } from "src/api/chat";
import { useRecoilValue } from "recoil";
import { friendAtom } from "src/data/friend.atom";
import EditableField from "../styled/EditableField";
import { MySocket } from "src/shared/chatSocket.proto";

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#EDF0F6",
  display: "flex",
  flexDirection: "column",
  rowGap: 16,
  padding: 8,
  borderRadius: 10,
  width: 280,
  height: "100%",
  "& > div": {
    backgroundColor: "white",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing(0.75)} ${theme.spacing(1)}`,
    "& .small-title": {
      fontSize: 12,
    },
  },
  "& > .board-head": {
    padding: 10,
    rowGap: 10,
    [`& .${avatarClasses.root}`]: {
      width: 64,
      height: 64,
    },
  },
  "& > .board-body": {},
}));

const ChatMemberBoard = (props: ChatMemberBoardProps) => {
  const { chatData, wss } = props;
  const firends = useRecoilValue(friendAtom);

  const handleNewGroupName = (value: string) => {
    console.log(value);
  };

  return (
    <StyledBox className="chat-member-board">
      <Box className="board-head board-section">
        <Avatar
          src={chatData.profile_pic ? getProfilePic(chatData.profile_pic) : ""}
          title={chatData.name}
        />
        <EditableField
          defaultValue={chatData.name}
          handleOnSubmit={handleNewGroupName}
        />
      </Box>
      <Box className="board-section">
        <TextField
          multiline
          maxRows={5}
          defaultValue={chatData.bio || ""}
          title={chatData.bio || ""}
          label="Bio"
          sx={{ width: "100%" }}
          disabled
        />
      </Box>
      <Box
        className="board-section"
        sx={{ alignItems: "flex-start !important" }}
      >
        <Typography variant="subtitle2" align="left">
          Friends
        </Typography>
        <List></List>
      </Box>
      <Box
        className="board-section"
        sx={{ alignItems: "flex-start !important" }}
      >
        <Typography variant="subtitle2" align="left">
          Members
        </Typography>
        <List></List>
      </Box>
    </StyledBox>
  );
};

export interface ChatMemberBoardProps {
  chatData: Data.Chat;
  wss: MySocket;
}

export default ChatMemberBoard;
