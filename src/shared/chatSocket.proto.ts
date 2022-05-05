import { Socket } from "socket.io-client";
import { UserState } from "src/data/user.atom";
import { Data } from "./data.proto";

export declare module SocketEvents {
  interface ListenEvents {
    "user:login": (code: SocketCodeMap, res: Error | UserState.Atom) => void;
    "user:status": (code: SocketCodeMap, res?: Error | Data.UserStatus) => void;
    "chat:create": (code: SocketCodeMap, res: Error | Data.Chat[]) => void;
    "chat:invite": (id: number) => void;
    "chat:get": (code: SocketCodeMap, res: Data.Chat[] | Error) => void;
    "chat:list": (
      code: SocketCodeMap,
      res?:
        | Error
        | {
            list: Data.Chat[];
            meta: {
              offset: number;
              limit: number;
              total: number;
            };
          }
    ) => void;
    "friend:list": (
      code: SocketCodeMap,
      res:
        | Error
        | {
            list: Data.Friend[];
            meta: {
              offset: number;
              limit: number;
              total: number;
            };
          }
    ) => void;
    "friend:status": (res: {
      userId: number;
      userHash: string;
      status: Data.UserStatus;
    }) => void;
    "member:list": (
      code: SocketCodeMap,
      res:
        | Error
        | {
            id: number;
            list: any[];
            meta: {
              offset: number;
              limit: number;
              total: number;
            };
          }
    ) => void;
    "message:update": (data: { chatId: number; list: Data.Message[] }) => void;
    "message:list": (
      code: SocketCodeMap,
      res?:
        | Error
        | {
            chatId: number;
            list: Data.Message[];
            meta: {
              offset: number;
              limit: number;
              total: number;
            };
          }
    ) => void;
    "message:delete": (code: SocketCodeMap, res: Error | number[]) => void;
    "message:modified": (
      chatId: number,
      data: {
        actions: "edit" | "delete";
        id: number;
        message?: string;
      }[]
    ) => void;
  }
  interface EmitEvents {
    "user:login": (token: string) => void;
    "user:status": (status: Data.UserStatus) => void;
    "chat:create": (
      data: Data.CreateGroupChat,
      members: {
        email?: string;
        userId?: number;
        role: Data.ParticipantRole;
      }[]
    ) => void;
    "chat:get": (chatId: number) => void;
    "chat:create/private": (data: { hash: string }) => void;
    "chat:get/private": (userHash: string) => void;
    "friend:listInChat": (chatId: number) => void;
    "friend:list": (offset?: number, limit?: number) => void;
    "friend:add": (data: { email: string; markedName: string }[]) => void;
    "friend:remove": (ids: number[]) => void;
    "member:list": (
      id: number,
      options: { offset?: number; limit?: number }
    ) => void;
    "message:send": (chatId: number, data: Data.SendMessage) => void;
    "message:list": (
      chatId: number,
      options: {
        offset?: number;
        limit?: number;
      }
    ) => void;
    "message:delete": (chatId: number, msgId: number[]) => void;
  }
}

export enum SocketCodeMap {
  success,
  jwtValid,
  jwtInvalid,
  undefinedUser,
  undefinedGroup,
  unauthorizedUser,
  unauthorizedRole,
  insertFail,
  updateFail,
  unknown,
}

export type MySocket = Socket<
  SocketEvents.ListenEvents,
  SocketEvents.EmitEvents
>;
