import { Avatar, Box, ListItemButton, styled, Typography } from "@mui/material";
import { getMsgDate } from "src/helpers/chatHelper";
import { Data } from "src/shared/data.proto";

const StyledItem = styled(ListItemButton)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "auto 4fr auto",
  columnGap: theme.spacing(1.5),
  height: 80,
  borderRadius: 12,
  paddingTop: theme.spacing(0.35),
  paddingBottom: theme.spacing(0.35),
  "&:not(:last-of-type)": {
    marginBottom: theme.spacing(0.25),
  },
  "& .head": {},
  "& .body": {
    display: "flex",
    flexDirection: "column",
    justifyContent: 'space-evenly',
    "& .trim-text": {
      textOverflow: "ellipsis",
      overflow: "hidden",
      width: "100%",
      whiteSpace: "nowrap",
    },
  },
  "& .trailing": {
    height: "100%",
  },
}));

const ChatItem = (props: ChatItemProps) => {
  const { data } = props;
  return (
    <StyledItem className="chat-item">
      <Box className="head">
        <Avatar src={data.profile_pic || ""} />
      </Box>
      <Box className="body">
        <Typography variant="subtitle1" fontWeight="bold" className="trim-text">
          {data.name}
        </Typography>
        <Typography variant="caption" className="trim-text">
          {data.message
            ? data.message
            : data.media && data.meta
            ? "Media"
            : `No Message Yet 
            sdfs asdfjioasef
            asfeasf
            asdjfiosajef
            asfjiosaef
            jifoasef
            sadjfioasejfo`}
        </Typography>
      </Box>
      <Box className="trailing">
        <Typography
          variant="caption"
          sx={{ fontSize: "0.55rem", color: "lightgrey" }}
        >
          {data.last_msg_time
            ? getMsgDate(data.last_msg_time)
            : getMsgDate(data.created)}
        </Typography>
      </Box>
    </StyledItem>
  );
};

export interface ChatItemProps {
  data: Data.Chat;
}

export default ChatItem;
