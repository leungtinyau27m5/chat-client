import {
  Box,
  Button,
  Hidden,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import { useParams, useSearchParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { chatListSelectorById } from "src/data/chatList.atom";
import { menuAtom } from "src/data/menu.atom";
import MessageField from "./MessageField";
import { useChatSocketCtx } from "src/providers/socket.io/chat/context";
import { useSnackbar } from "notistack";
import { Data } from "src/shared/data.proto";
import MessageList from "./MessageList";
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";

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
      overflow: 'auto'
    },
    "& .trailing": {},
  },
}));

const ChatRoom = () => {
  const [searchParams] = useSearchParams();
  const id = Number(searchParams.get("id"));
  const { wss, isLogin } = useChatSocketCtx();
  const chatData = useRecoilValue(chatListSelectorById(id));
  const setShowMenu = useSetRecoilState(menuAtom);
  const { enqueueSnackbar } = useSnackbar();

  const sendMessage = (data: Data.SendMessage) => {
    if (!isLogin) return;
    if (!id) return;
    wss.emit("message:send", id, data);
  };

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
        <Box className="body">
          <MessageList chatId={id} />
        </Box>
        <Box className="trailing">
          <MessageField sendMessage={sendMessage} />
        </Box>
      </Box>
    </StyledBox>
  );
};

export default ChatRoom;
