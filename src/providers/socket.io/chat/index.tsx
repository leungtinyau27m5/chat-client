import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { MySocket, SocketEvents } from "src/shared/chatSocket.proto";
import { ChatSocketContext } from "./context";
import { io } from "socket.io-client";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userSelector } from "src/data/user.atom";
import { SnackbarKey, useSnackbar } from "notistack";
import { Button } from "@mui/material";
import { chatListAtom } from "src/data/chatList.atom";
import { Data } from "src/shared/data.proto";
import MessageHandler from "./handlers/message";
import ChatHandler from "./handlers/chat";
import UserHandler from "./handlers/user";

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
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const setChatList = useSetRecoilState(chatListAtom);

  const emitLogin = useCallback(() => {
    if (!userData) return;
    wss.emit("user:login", userData.token);
  }, [userData, wss]);

  const getFriendList = useCallback(() => {
    wss.emit("friend:list");
  }, [wss]);

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
    [setChatList]
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
      setIsLogin(true);
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

  useEffect(() => {
    if (isLogin) {
      getFriendList();
    }
  }, [isLogin, getFriendList]);

  return (
    <ChatSocketContext.Provider
      value={{
        wss,
        connected,
        isLogin,
      }}
    >
      {props.children}
      {wss && <MessageHandler wss={wss} />}
      {wss && <ChatHandler wss={wss} />}
      {wss && <UserHandler wss={wss} />}
    </ChatSocketContext.Provider>
  );
};

export interface ChatSocketProviderProps {
  children?: ReactNode;
}

export default ChatSocketProvider;
