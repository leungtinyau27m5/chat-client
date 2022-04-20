import { createContext, useContext } from "react";

export declare namespace ChatSocketCtx {}

export const ChatSocketContext = createContext({});

export const useChatSocketCtx = () => useContext(ChatSocketContext);
