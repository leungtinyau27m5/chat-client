import { useEffect, useMemo } from "react";
import {
  Box,
  styled,
  Avatar,
  Typography,
  avatarClasses,
  TextField,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Data } from "src/shared/data.proto";
import { getProfilePic } from "src/api/chat";
import { useRecoilValue } from "recoil";
import { friendAtom, friendSelectorById } from "src/data/friend.atom";
import EditableField from "../styled/EditableField";
import { MySocket } from "src/shared/chatSocket.proto";
import { Link } from "react-router-dom";
import AvatarContainer from "../styled/AvatarContainer";
import {
  memberListAtomSelectorByChatId,
  memberMetaSelectorByChatId,
} from "src/data/member.atom";
import { userSelector } from "src/data/user.atom";

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
  "& > .board-body": {
    "& > .title": {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    "& .member-item": {
      borderRadius: 8,
      "&:not(:last-of-type)": {},
      "& .desc": {
        display: "grid",
        gridTemplateRows: "20px 20px",
        rowGap: 4,
      },
    },
  },
}));

const ChatMemberBoard = (props: ChatMemberBoardProps) => {
  const { chatData, list, wss } = props;
  const userData = useRecoilValue(userSelector);
  const memberMeta = useRecoilValue(memberMetaSelectorByChatId(chatData.id));

  const onlineMemberList = useMemo(() => {
    return list.filter((ele) => !["offline", "hide"].includes(ele.status));
  }, [list]);

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
        className="board-section board-body"
        sx={{ alignItems: "flex-start !important" }}
      >
        <Typography variant="subtitle2" align="left">
          Friends
        </Typography>
        <List sx={{ width: "100%" }}></List>
      </Box>
      <Box
        className="board-section board-body"
        sx={{ alignItems: "flex-start !important" }}
      >
        <Box className="title">
          <Typography variant="subtitle2" align="left">
            Members
          </Typography>
          <Typography variant="caption" align="right">
            {onlineMemberList.length} / {memberMeta?.total}
          </Typography>
        </Box>
        <List sx={{ width: "100%" }}>
          {list.map((ele) => (
            <Link
              to={`/private?hash=${ele.hash}`}
              key={ele.id}
              style={{
                pointerEvents: userData?.id === ele.id ? "none" : "auto",
              }}
            >
              <ListItemButton className="member-item">
                <ListItemIcon>
                  <AvatarContainer
                    src={ele.profile_pic ? getProfilePic(ele.profile_pic) : ""}
                    avatarProps={{
                      sx: {
                        width: 32,
                        height: 32,
                      },
                    }}
                    status={ele.status}
                  />
                </ListItemIcon>
                <Box className="desc">
                  <Typography variant="body1" title={ele.username}>
                    {ele.username} {userData?.id === ele.id ? "(Me)" : ""}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(128, 128, 128, 1)" }}
                    title={ele.bio || ""}
                  >
                    {ele.bio?.substring(0, 15)}
                  </Typography>
                </Box>
              </ListItemButton>
            </Link>
          ))}
        </List>
      </Box>
    </StyledBox>
  );
};

export interface ChatMemberBoardProps {
  chatData: Data.Chat;
  list: Data.Member[];
  wss: MySocket;
}

export default ChatMemberBoard;
