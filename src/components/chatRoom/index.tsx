import { useEffect, useRef, useCallback, useLayoutEffect } from "react";
import {
  Box,
  Button,
  Hidden,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  chatListSelectorById,
  chatRoomMetaSelectorById,
  initChatRoomMeta,
} from "src/data/chatList.atom";
import { menuAtom } from "src/data/menu.atom";
import MessageField from "./MessageField";
import { useChatSocketCtx } from "src/providers/socket.io/chat/context";
import { useSnackbar } from "notistack";
import { Data } from "src/shared/data.proto";
import MessageList from "./MessageList";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import { messageListMetaSelectorByChatId } from "src/data/messageList.atom";

const StyledBox = styled(Box)(({ theme }) => ({
  height: "-webkit-fill-available",
  flex: 1,
  padding: theme.spacing(2),
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
    "& .head": {
      height: 54,
      display: "flex",
      alignItems: "center",
      padding: "0 1rem",
      justifyContent: "space-between",
      boxShadow: "0px 2px 15px rgba(15, 15, 15, 0.05)",
    },
    "& .body": {
      flex: 1,
      overflow: "auto",
    },
    "& .trailing": {},
  },
}));

const ChatRoom = () => {
  const [searchParams] = useSearchParams();
  const id = Number(searchParams.get("id"));
  const { wss, isLogin } = useChatSocketCtx();
  const chatData = useRecoilValue(chatListSelectorById(id));
  const messageMeta = useRecoilValue(messageListMetaSelectorByChatId(id));
  const [roomMeta, setRoomMeta] = useRecoilState(chatRoomMetaSelectorById(id));
  const setShowMenu = useSetRecoilState(menuAtom);
  const { enqueueSnackbar } = useSnackbar();
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
    const heightStr = roomMeta?.top;
    let height = 0;
    const handleHeight = (evt: Event) => {
      const target = evt.target as HTMLDivElement;
      height = target.scrollTop;
    };
    body?.addEventListener("scroll", handleHeight);
    if (heightStr) {
      body?.scrollTo({
        top: Number(heightStr),
      });
    }
    return () => {
      body?.removeEventListener("scroll", handleHeight);
      setRoomMeta((state) => {
        if (!state) return { ...initChatRoomMeta(), top: height };
        return {
          ...state,
          top: height,
        };
      });
    };
  }, [id, roomMeta, setRoomMeta]);

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
              <Typography variant="h6">{chatData.name.slice(0, 15)}</Typography>
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
        <Box className="body" ref={bodyRef}>
          {isLogin && bodyRef.current && (
            <MessageList chatId={id} wss={wss} bodyEl={bodyRef.current} />
          )}
        </Box>
        <Box className="trailing">
          <MessageField sendMessage={sendMessage} />
        </Box>
      </Box>
    </StyledBox>
  );
};

export default ChatRoom;
