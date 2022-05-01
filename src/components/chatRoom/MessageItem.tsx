import { ChangeEvent, forwardRef, memo, Ref, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Checkbox,
  Divider,
  dividerClasses,
  IconButton,
  iconButtonClasses,
  listClasses,
  ListItemText,
  Menu,
  MenuItem,
  menuItemClasses,
  styled,
  Typography,
} from "@mui/material";
import { Data } from "src/shared/data.proto";
import { useRecoilValue } from "recoil";
import { friendSelectorById } from "src/data/friend.atom";
import { getMsgDate } from "src/helpers/chatHelper";
import { getProfilePic } from "src/api/chat";
import clsx from "clsx";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import MessageActionMenu from "./MessageActionMenu";
import { Link } from "react-router-dom";
import AvatarAndZoom from "../dialogs/AvatarAndZoom";

const StyledBox = styled(Box)(({ theme }) => ({
  padding: "0.5rem",
  width: "100%",
  "& .inner": {
    display: "flex",
    columnGap: 8,
    "& .icon-wrapper": {
      display: "flex",
      alignItems: "flex-end",
    },
    "& .message-wrapper-outer": {
      display: "flex",
      flexDirection: "column",
      "& .message-wrapper-inner": {
        position: "relative",
        backgroundColor: "white",
        padding: "6px 15px",
        borderRadius: 5,
        fontSize: 14,
        overflowWrap: "break-word",
        whiteSpace: "pre-wrap",
        width: "fit-content",
        maxWidth: "calc(800px * 0.7)",
        [theme.breakpoints.down("lg")]: {
          maxWidth: "calc(60vw * 0.7)",
        },
        [theme.breakpoints.down("md")]: {
          maxWidth: "calc(100vw * 0.7)",
          fontSize: 13,
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
    "& .actions-wrapper": {
      visibility: "hidden",
      display: "flex",
      alignItems: "flex-end",
      transform: "translateX(10px)",
      transition: "all .1s ease-in-out",
      opacity: 0,
      [`& > .${iconButtonClasses.root}`]: {
        padding: 4,
      },
      "&.active": {
        visibility: "visible",
        transform: "translateX(0px)",
        opacity: 1,
      },
    },
    "&:hover": {
      "& .actions-wrapper": {
        visibility: "visible",
        transform: "translateX(0px)",
        opacity: 1,
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

const MessageItem = memo(
  forwardRef((props: MessageItemProps, ref: Ref<HTMLDivElement>) => {
    const { data, isMe, isSelected, handleItemSelection, onSelectMode } = props;
    const friendData = useRecoilValue(friendSelectorById(data.user_id));
    const msgDate = getMsgDate(data.created);
    const moreActionRef = useRef<HTMLButtonElement>(null);
    const [showActionMenu, setShowActionMenu] = useState(false);

    const toggleActionMenu = () => {
      if (onSelectMode) return;
      setShowActionMenu((state) => !state);
    };

    const handleAction = (type: "select" | "edit" | "delete") => {
      toggleActionMenu();
      switch (type) {
        case "select": {
          handleItemSelection(data.id);
          break;
        }
        case "edit":
          break;
        case "delete":
          break;
        default: {
        }
      }
    };

    return (
      <StyledBox
        className={clsx("message-item", { "is-me": isMe })}
        ref={ref}
        data-date={msgDate.date}
        data-id={data.id}
      >
        <Box className="inner">
          <Box className="icon-wrapper">
            <AvatarAndZoom
              title={data.username}
              src={data.profile_pic ? getProfilePic(data.profile_pic) : ""}
              sx={{
                width: 30,
                height: 30,
              }}
            />
          </Box>
          <Box className="message-wrapper-outer">
            <Box className="message-meta">
              {!isMe && (
                <Link to={`/private?id=${data.sender_id}`}>
                  <Typography
                    component="span"
                    variant="caption"
                    color="blueviolet"
                  >
                    {data.username},&nbsp;
                  </Typography>
                </Link>
              )}
              <Typography component="span" variant="caption">
                {msgDate.time}
              </Typography>
            </Box>
            <Box className="message-wrapper-inner">{data.message}</Box>
          </Box>
          {isMe && (
            <Box className={clsx("actions-wrapper", { active: onSelectMode })}>
              <IconButton
                onClick={toggleActionMenu}
                ref={moreActionRef}
                sx={{
                  visibility: onSelectMode ? "hidden" : "visible",
                }}
              >
                <ExpandMoreRoundedIcon fontSize="small" />
              </IconButton>
              {onSelectMode && (
                <Checkbox
                  checked={isSelected}
                  onChange={() => handleAction("select")}
                />
              )}
            </Box>
          )}
          {isMe && (
            <MessageActionMenu
              open={showActionMenu}
              anchorEl={moreActionRef.current}
              handleAction={handleAction}
              menuProps={{
                onClose: () => toggleActionMenu(),
                anchorOrigin: {
                  vertical: "center",
                  horizontal: isMe ? "left" : "right",
                },
                transformOrigin: {
                  vertical: "center",
                  horizontal: isMe ? "right" : "left",
                },
              }}
            />
          )}
        </Box>
      </StyledBox>
    );
  })
);

export interface MessageItemProps {
  data: Data.Message;
  isMe: boolean;
  isSelected: boolean;
  onSelectMode: boolean;
  handleItemSelection: (id: number) => void;
  setFirstRef?: (ele: HTMLDivElement) => void;
}

export default MessageItem;
