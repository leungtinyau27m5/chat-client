import { Avatar, Box, ListItemButton, styled, Typography } from "@mui/material";
import clsx from "clsx";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { getProfilePic } from "src/api/chat";
import { lastMessageSelector } from "src/data/messageList.atom";
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
    "& >span": {
      lineHeight: "inherit",
    },
    [theme.breakpoints.down("sm")]: {
      width: "10ch",
    },
  },
}));

const ChatItem = (props: ChatItemProps) => {
  const { data, isActive, handleOnClick } = props;
  const lastMessage = useRecoilValue(lastMessageSelector(data.id));

  return (
    <StyledItem
      className={clsx("chat-item", { active: isActive })}
      onClick={() => handleOnClick(data.id)}
    >
      <Box className="head">
        <Avatar src={data.profile_pic ? getProfilePic(data.profile_pic) : ""} />
      </Box>
      <Box className="body">
        <Typography variant="subtitle1" fontWeight="bold" className="trim-text">
          {data.name}
        </Typography>
        {lastMessage ? (
          <Typography variant="caption" className="trim-text">
            {lastMessage.message
              ? lastMessage.message
              : lastMessage.media && lastMessage.meta
              ? "Media"
              : `No Message Yet`}
          </Typography>
        ) : (
          <Typography variant="caption" className="trim-text">
            {data.message
              ? data.message
              : data.media && data.media
              ? "Media"
              : "No Message Yet"}
          </Typography>
        )}
      </Box>
      <Box className="trailing">
        <Typography
          variant="caption"
          sx={{ fontSize: "0.55rem", color: "rgb(150, 150, 150)" }}
        >
          {/* {data.last_msg_time
            ? getMsgDate(data.last_msg_time)
            : getMsgDate(data.created)} */}
        </Typography>
      </Box>
    </StyledItem>
  );
};

export interface ChatItemProps {
  data: Data.Chat;
  isActive: boolean;
  handleOnClick: (id: number) => void;
}

export default ChatItem;
