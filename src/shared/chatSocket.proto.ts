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
  }
  interface EmitEvents {
    "user:login": (token: string) => void;
  }
}

export enum SocketCodeMap {
  jwtValid,
  jwtInvalid,
  undefinedUser,
  undefinedGroup,
  unauthorizedUser,
  unauthorizedRole,
  unknown,
  success,
}

export type MySocket = Socket<
  SocketEvents.ListenEvents,
  SocketEvents.EmitEvents
>;
