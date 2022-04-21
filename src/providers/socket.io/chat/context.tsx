import { createContext, useContext } from "react";
import { MySocket } from "src/shared/chatSocket.proto";

export declare namespace ChatSocketCtx {
  interface State {
    wss: MySocket;
    connected: boolean;
    isLogin: boolean;
  }
}

export const ChatSocketContext = createContext<ChatSocketCtx.State>(
  {} as ChatSocketCtx.State
);

export const useChatSocketCtx = () => useContext(ChatSocketContext);
