import { Avatar, Box, ListItemButton, styled, Typography } from "@mui/material";
import clsx from "clsx";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { getProfilePic } from "src/api/chat";
import { chatUnreadSelectorById } from "src/data/chatList.atom";
import { userSelector } from "src/data/user.atom";
import { getMsgDate } from "src/helpers/chatHelper";
import { Data } from "src/shared/data.proto";


const StyledItem = styled(ListItemButton)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "auto 4fr auto",
  columnGap: theme.spacing(1.5),
  height: 80,
  borderRadius: 12,
  padding: "0.35rem 0.5rem",
  "&.active": {
    backgroundColor: "rgba(15, 15, 15, 0.05)",
  },
  "&:not(:last-of-type)": {
    marginBottom: theme.spacing(0.25),
  },
  "& > .head": {},
  "& > .body": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    "& .trim-text": {
      textOverflow: "ellipsis",
      overflow: "hidden",
      width: "100%",
      whiteSpace: "nowrap",
    },
  },
  "& > .trailing": {
    position: "absolute",
    top: 8,
    right: 8,
    lineHeight: 1,
    width: "fit-content",
    textAlign: "right",
    "& span": {
      lineHeight: "inherit",
    },
    "& .unread-count": {
      padding: 4,
      backgroundColor: theme.palette.primary.main,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "whitesmoke",
      borderRadius: "50%",
      width: 18,
      height: 18,
      fontSize: "0.5rem",
      marginTop: "10%",
      marginLeft: "auto",
    },
    [theme.breakpoints.down("sm")]: {
      width: "10ch",
    },
  },
}));

const ChatItem = (props: ChatItemProps) => {
  const { data, isActive, handleOnClick } = props;
  const userData = useRecoilValue(userSelector);
  const unread = useRecoilValue(chatUnreadSelectorById(data.id));
  const msgTime = useMemo(() => {
    if (data.last_msg_time) return getMsgDate(data.last_msg_time);
    else return getMsgDate(data.created);
  }, [data.last_msg_time, data.created]);

  return (
    <StyledItem
      className={clsx("chat-item", { active: isActive })}
      onClick={() => handleOnClick(data.hash)}
    >
      <Box className="head">
        <Avatar src={data.profile_pic ? getProfilePic(data.profile_pic) : ""} />
      </Box>
      <Box className="body">
        <Typography
          variant="subtitle1"
          className="trim-text"
          fontWeight={400}
          title={data.name}
        >
          {data.name}
        </Typography>
        <Typography
          variant="caption"
          className="trim-text"
          title={data.message || data.media || ""}
        >
          {data
            ? `${
                userData?.id === data.user_id ? "you: " : `${data.username}: `
              }${
                data.message
                  ? data.message
                  : data.media && data.meta
                  ? "Media"
                  : "No Message Yet"
              }`
            : ""}
        </Typography>
      </Box>
      <Box className="trailing">
        <Typography
          variant="caption"
          sx={{ fontSize: "0.55rem", color: "rgb(150, 150, 150)" }}
        >
          {msgTime.date === "Today"
            ? msgTime.time
            : msgTime.date === "Yesterday"
            ? `${msgTime.date} ${msgTime.time}`
            : msgTime.date}
        </Typography>
        {unread.length !== 0 && (
          <Box className="unread-count">{unread.length}</Box>
        )}
      </Box>
    </StyledItem>
  );
};

export interface ChatItemProps {
  data: Data.Chat;
  isActive: boolean;
  handleOnClick: (hash: string) => void;
}

export default ChatItem;
