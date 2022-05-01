import { useEffect, useRef, useCallback, useLayoutEffect } from "react";
import {
  Box,
  Button,
  Hidden,
  IconButton,
  styled,
  Typography,
  Avatar,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  chatListSelectorById,
  chatRoomScrollTopSelectorById,
} from "src/data/chatList.atom";
import { menuAtom } from "src/data/menu.atom";
import MessageField from "./MessageField";
import { useChatSocketCtx } from "src/providers/socket.io/chat/context";
import { Data } from "src/shared/data.proto";
import MessageList from "./MessageList";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import { messageListMetaSelectorByChatId } from "src/data/messageList.atom";
import ScrollButton from "./ScrollButton";
import { SocketEvents } from "src/shared/chatSocket.proto";
import { userSelector } from "src/data/user.atom";

const StyledBox = styled(Box)(({ theme }) => ({
  height: "-webkit-fill-available",
  flex: 1,
  padding: `${theme.spacing(2)} 0`,
  display: "flex",
  [theme.breakpoints.down("lg")]: {
    padding: 0,
  },
  [theme.breakpoints.down("md")]: {},
  "& .room-inner": {
    flex: 1,
    height: "100%",
    backgroundColor: "#EDF0F6",
    borderRadius: 15,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    position: "relative",
    "& > .head": {
      height: 54,
      display: "flex",
      alignItems: "center",
      padding: "0 1rem",
      justifyContent: "space-between",
      boxShadow: "0px 2px 15px rgba(15, 15, 15, 0.05)",
    },
    "& > .body": {
      flex: 1,
      overflow: "auto",
      "& .date-marks": {
        fontSize: "0.8rem",
        textAlign: "center",
        width: "fit-content",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 8,
      },
      "& .fixed-top-container": {
        position: "absolute",
        top: 54,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& .select-summary": {
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${theme.spacing(0.25)} ${theme.spacing(1)}`,
          backgroundColor: theme.palette.secondary.light,
          "& > div": {
            display: "flex",
            alignItems: "center",
          },
        },
        "& .current-date-mark": {
          marginTop: 5,
          fontSize: "0.8rem",
          color: "whitesmoke",
          width: "fit-content",
          backgroundColor: "rgba(30, 30, 30, 0.55)",
          borderRadius: 8,
        },
      },
    },
    "& > .trailing": {},
  },
}));

const ChatRoom = () => {
  const [searchParams] = useSearchParams();
  const id = Number(searchParams.get("id"));
  const { wss, isLogin } = useChatSocketCtx();
  const userData = useRecoilValue(userSelector);
  const chatData = useRecoilValue(chatListSelectorById(id));
  const messageMeta = useRecoilValue(messageListMetaSelectorByChatId(id));
  const [roomScrollTop, setRoomScrollTop] = useRecoilState(
    chatRoomScrollTopSelectorById(id)
  );
  const setShowMenu = useSetRecoilState(menuAtom);
  const heightRef = useRef(roomScrollTop || 0);
  const bodyRef = useRef<HTMLDivElement>(null);

  const sendMessage = (data: Data.SendMessage) => {
    if (!isLogin) return;
    if (!id) return;
    wss.emit("message:send", id, data);
  };

  const getList = useCallback(
    (offset: number) => {
      wss.emit("message:list", id, {
        offset: offset,
        limit: 20,
      });
    },
    [id, wss]
  );

  const handleMessageUpdate: SocketEvents.ListenEvents["message:update"] =
    useCallback(
      (data) => {
        const body = bodyRef.current;
        if (data.chatId !== id) return;
        if (!body) return;
        if (
          body.scrollHeight - 610 < body.scrollTop ||
          data.list[0].sender_id === userData?.id
        ) {
          setTimeout(() => {
            body.scrollTo({
              top: body.scrollHeight,
              behavior: "smooth",
            });
          });
        }
      },
      [id, userData?.id]
    );

  useEffect(() => {
    if (!isLogin) return;
    if (!messageMeta) getList(0);
  }, [getList, isLogin, messageMeta]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const handleScroll = () => {
      if (body.scrollTop === 0 && messageMeta) {
        if (messageMeta.offset < messageMeta.total)
          getList(messageMeta.offset + 20);
      }
    };
    body.addEventListener("scroll", handleScroll);
    return () => {
      body.removeEventListener("scroll", handleScroll);
    };
  }, [getList, messageMeta]);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    return () => {
      setRoomScrollTop(heightRef.current);
    };
  }, [id, setRoomScrollTop]);

  useLayoutEffect(() => {
    if (roomScrollTop) {
      bodyRef.current?.scrollTo({
        top: roomScrollTop,
        behavior: "smooth",
      });
    } else if (messageMeta?.page === 1) {
      bodyRef.current?.scrollTo({
        top: bodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [roomScrollTop, messageMeta]);

  useLayoutEffect(() => {
    wss.on("message:update", handleMessageUpdate);
    return () => {
      wss.off("message:update", handleMessageUpdate);
    };
  }, [wss, handleMessageUpdate]);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const handleScrollPostion = (evt: Event) => {
      const target = evt.target as HTMLDivElement;
      const height = target.scrollTop;
      heightRef.current = height;
    };
    body.addEventListener("scroll", handleScrollPostion);
    return () => {
      body.removeEventListener("scroll", handleScrollPostion);
    };
  }, []);

  return (
    <StyledBox className="chat-room">
      <Box className="room-inner">
        <Box className="head">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Hidden mdUp>
              <IconButton onClick={() => setShowMenu(true)} sx={{ mr: 1 }}>
                <MenuOpenRoundedIcon />
              </IconButton>
            </Hidden>
            {chatData && (
              <>
                <Avatar
                  src={chatData.profile_pic || ""}
                  sx={{
                    width: 34,
                    height: 34,
                    mr: 1.5,
                  }}
                />
                <Typography variant="h6">
                  {chatData.name.slice(0, 15)}
                </Typography>
              </>
            )}
          </Box>
          {chatData && (
            <Box>
              <Button color="secondary">
                <PeopleAltRoundedIcon />
              </Button>
              <Button color="secondary">
                <CategoryRoundedIcon />
              </Button>
            </Box>
          )}
        </Box>
        <Box className="body min-scrollbar" ref={bodyRef}>
          {isLogin && bodyRef.current && (
            <MessageList chatId={id} wss={wss} bodyEl={bodyRef.current} />
          )}
        </Box>
        <Box className="trailing">
          <MessageField sendMessage={sendMessage} chatId={id} />
        </Box>
        {isLogin && bodyRef.current && (
          <ScrollButton
            chatId={id}
            wss={wss}
            bodyEl={bodyRef.current}
          ></ScrollButton>
        )}
      </Box>
    </StyledBox>
  );
};

export default ChatRoom;
