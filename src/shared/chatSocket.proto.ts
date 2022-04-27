import { Socket } from "socket.io-client";
import { UserState } from "src/data/user.atom";
import { Data } from "./data.proto";

export declare module SocketEvents {
  interface ListenEvents {
    "user:login": (code: SocketCodeMap, res: Error | UserState.Atom) => void;
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
  }
  interface EmitEvents {
    "user:login": (token: string) => void;
    "message:send": (chatId: number, data: Data.SendMessage) => void;
    "message:list": (
      chatId: number,
      options: {
        offset?: number;
        limit?: number;
      }
    ) => void;
    "chat:create": (
      data: Data.CreateGroupChat,
      members: {
        email?: string;
        userId?: number;
        role: Data.ParticipantRole;
      }[]
    ) => void;
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
  unknown,
}

export type MySocket = Socket<
  SocketEvents.ListenEvents,
  SocketEvents.EmitEvents
>;
