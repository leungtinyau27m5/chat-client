import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
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
} from "@mui/material";
import { Data } from "src/shared/data.proto";
import { getChatProfilePic, getProfilePic } from "src/api/chat";
import { useRecoilValue } from "recoil";
import EditableField from "../styled/EditableField";
import { MySocket } from "src/shared/chatSocket.proto";
import AvatarContainer from "../styled/AvatarContainer";
import {
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
  const memberListRef = useRef<HTMLUListElement>(null);

  const onlineMemberList = useMemo(() => {
    return list.filter((ele) => !["offline", "hide"].includes(ele.status));
  }, [list]);

  const handleNewGroupName = (value: string) => {
    console.log(value);
  };

  const handleScroll = useCallback(
    (evt: Event) => {
      if (!memberMeta) return;
      const target = evt.target as HTMLElement;
      const scrollPos =
        target.scrollTop + target.getBoundingClientRect().height;
      if (Math.floor(scrollPos) === Math.floor(target.scrollHeight)) {
        if (memberMeta.offset < memberMeta.total) {
          wss.emit("member:list", chatData.id, {
            offset: memberMeta.offset + 20,
          });
        }
      }
    },
    [chatData.id, memberMeta, wss]
  );

  useLayoutEffect(() => {
    if (!memberListRef.current) return;
    const ref = memberListRef.current;
    ref.addEventListener("scroll", handleScroll);
    return () => {
      ref.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <StyledBox className="chat-member-board">
      <Box className="board-head board-section">
        <Avatar
          src={
            chatData.profile_pic ? getChatProfilePic(chatData.profile_pic) : ""
          }
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
        <List
          sx={{ width: "100%", maxHeight: "50vh", overflowY: "auto" }}
          className="min-scrollbar"
          ref={memberListRef}
        >
          {list.map((ele) => (
            <ListItemButton
              className="member-item"
              key={ele.id}
              style={{
                pointerEvents: userData?.id === ele.id ? "none" : "auto",
              }}
            >
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
