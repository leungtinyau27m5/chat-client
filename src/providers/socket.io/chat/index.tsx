import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  MySocket,
  SocketCodeMap,
  SocketEvents,
} from "src/shared/chatSocket.proto";
import { ChatSocketContext } from "./context";
import { io } from "socket.io-client";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userSelector } from "src/data/user.atom";
import { getCookie } from "src/utils/storages";
import { useNavigate } from "react-router-dom";
import { SnackbarKey, useSnackbar } from "notistack";
import { Button } from "@mui/material";
import { chatListAtom, chatMetaAtom } from "src/data/chatList.atom";
import { Data } from "src/shared/data.proto";

const ChatSocketProvider = (props: ChatSocketProviderProps) => {
  const { current: wss } = useRef<MySocket>(
    io(process.env.REACT_APP_CHAT_SOCKET as string, {
      autoConnect: false,
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
    })
  );
  const [connected, setConnected] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const userData = useRecoilValue(userSelector);
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const setChatList = useSetRecoilState(chatListAtom);
  const setChatMeta = useSetRecoilState(chatMetaAtom);

  const emitLogin = useCallback(() => {
    if (!userData) return;
    wss.emit("user:login", userData.token);
  }, [userData, wss]);

  const handleChatList: SocketEvents.ListenEvents["chat:list"] = useCallback(
    (code, res) => {
      if (res instanceof Error) {
        console.error(res);
        return;
      }
      if (res && "list" in res) {
        setChatList((state) => {
          let newData = {} as { [key: number]: Data.Chat };
          res.list.forEach((ele) => (newData[ele.id] = ele));
          return {
            ...newData,
            ...state,
          };
        });
      }
    },
    []
  );

  useEffect(() => {
    const handleConnect = () => {
      setConnected(true);
      emitLogin();
    };
    const handleDisconnect = () => {
      setConnected(false);
    };
    const handleLogin: SocketEvents.ListenEvents["user:login"] = (
      code,
      res
    ) => {
      if (res instanceof Error) {
        const handleRetry = (key: SnackbarKey) => {
          closeSnackbar(key);
          emitLogin();
        };
        enqueueSnackbar("scoket is not logged in: " + res.message, {
          variant: "error",
          action: (key) => (
            <Button onClick={() => handleRetry(key)}>Retry</Button>
          ),
        });
        return;
      }
      console.log(res);
    };
    wss.on("connect", handleConnect);
    wss.on("disconnect", handleDisconnect);
    wss.on("user:login", handleLogin);
    return () => {
      wss.off("connect", handleConnect);
      wss.off("disconnect", handleDisconnect);
      wss.off("user:login", handleLogin);
    };
  }, [closeSnackbar, emitLogin, enqueueSnackbar, wss]);

  useEffect(() => {
    wss.on("chat:list", handleChatList);
    return () => {
      wss.off("chat:list");
    };
  }, [handleChatList, wss]);

  useEffect(() => {
    if (!userData) return;
    wss.connect();
    return () => {
      wss.disconnect();
    };
  }, [userData, wss]);

  return (
    <ChatSocketContext.Provider value={{}}>
      {props.children}
    </ChatSocketContext.Provider>
  );
};

export interface ChatSocketProviderProps {
  children?: ReactNode;
}

export default ChatSocketProvider;
