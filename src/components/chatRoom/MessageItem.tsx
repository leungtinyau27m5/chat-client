import { forwardRef, Ref, useEffect, useLayoutEffect, useRef } from "react";
import { Avatar, Box, styled, Typography } from "@mui/material";
import { Data } from "src/shared/data.proto";
import { useRecoilValue } from "recoil";
import { friendSelectorById } from "src/data/friend.atom";
import { getMsgDate } from "src/helpers/chatHelper";
import { getProfilePic } from "src/api/chat";
import clsx from "clsx";
import { formatDate } from "src/helpers/common";

const StyledBox = styled(Box)(({ theme }) => ({
  padding: "1rem",
  width: "100%",
  "& .inner": {
    display: "flex",
    columnGap: 8,
    "& .icon-wrapper": {
      display: "flex",
      alignItems: "flex-end",
    },
    "& .message-wrapper-outer": {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      "& .message-wrapper-inner": {
        position: "relative",
        backgroundColor: "white",
        padding: 12,
        borderRadius: 15,
        overflowWrap: "break-word",
        whiteSpace: "pre-wrap",
        width: "fit-content",
        maxWidth: "calc(800px * 0.7)",
        [theme.breakpoints.down("lg")]: {
          maxWidth: "calc(60vw * 0.7)",
        },
        [theme.breakpoints.down("md")]: {
          maxWidth: "calc(100vw * 0.7)",
        },
        "&::before": {
          content: "''",
          position: "absolute",
          left: -4,
          bottom: 0,
          width: 16,
          height: 16,
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          backgroundColor: "white",
        },
      },
    },
  },
  "&.is-me": {
    "& .inner": {
      flexDirection: "row-reverse",
      "& .message-wrapper-outer": {
        alignItems: "flex-end",

        "& .message-meta": {
          textAlign: "right",
        },
        "& .message-wrapper-inner": {
          textAlign: "right",
          "&::before": {
            right: -4,
            left: "auto",
          },
        },
      },
    },
  },
}));

const MessageItem = forwardRef(
  (props: MessageItemProps, ref: Ref<HTMLDivElement>) => {
    const { data, isMe } = props;
    const friendData = useRecoilValue(friendSelectorById(data.user_id));
    const msgDate = getMsgDate(data.created);

    return (
      <StyledBox
        className={clsx("message-item", { "is-me": isMe })}
        ref={ref}
        data-date={msgDate.date}
      >
        <Box className="inner">
          <Box className="icon-wrapper">
            <Avatar
              src={data.profile_pic ? getProfilePic(data.profile_pic) : ""}
              sx={{
                width: 30,
                height: 30,
              }}
            />
          </Box>
          <Box className="message-wrapper-outer">
            <Box className="message-meta">
              <Typography component="span" variant="caption">
                {data.username},&nbsp;
              </Typography>
              <Typography component="span" variant="caption">
                {msgDate.time}
              </Typography>
            </Box>
            <Box className="message-wrapper-inner">{data.message}</Box>
          </Box>
        </Box>
      </StyledBox>
    );
  }
);

export interface MessageItemProps {
  data: Data.Message;
  isMe: boolean;
  setFirstRef?: (ele: HTMLDivElement) => void;
}

export default MessageItem;
